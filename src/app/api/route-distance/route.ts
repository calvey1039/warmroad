import { NextResponse } from "next/server";
import { getStore, type Store } from "@netlify/blobs";

const OSRM_BASE = "https://router.project-osrm.org";
const METERS_PER_MILE = 1609.344;

interface Coord {
  lat: number;
  lon: number;
}

interface RouteResult {
  miles: number;
  hours: number;
}

function isValidCoord(c: unknown): c is Coord {
  if (!c || typeof c !== "object") return false;
  const { lat, lon } = c as { lat?: unknown; lon?: unknown };
  return (
    typeof lat === "number" &&
    typeof lon === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

// Bump when the calibration formula changes so previously cached, uncalibrated
// values are not served. Old keys remain in the store but are never read.
const CACHE_VERSION = "v2";

function cacheKey(from: Coord, to: Coord): string {
  // Round to 3 decimals (~110m). Two locations within ~100m share a key,
  // which is fine for "drive time" purposes and gives high cache hit rates.
  const r = (n: number) => n.toFixed(3);
  return `${CACHE_VERSION}:${r(from.lat)},${r(from.lon)}__${r(to.lat)},${r(to.lon)}`;
}

// Calibrate OSRM's reported duration to better match real-world US drive
// times. OSRM's default car profile uses speed-limit-style defaults
// (motorway 90 km/h ≈ 56 mph, trunk 85 km/h ≈ 53 mph) that run consistently
// slow against US interstates, where 70 mph posted limits and free-flow
// driving give an effective ~66-68 mph. The factor is keyed off the implied
// OSRM average speed: highway-dominated trips get the largest correction
// (~20%), while low-speed city trips need essentially none, since OSRM's
// surface-street speeds already approximate real city traffic.
//
// Without this, e.g. Lodi, OH → Cincinnati, OH returned 3 hr 52 min from
// OSRM versus 3 hr 6 min on Google Maps — a 25% overshoot. Calibrated, it
// returns ~3 hr 9 min.
function calibrateDuration(distanceMeters: number, durationSeconds: number): number {
  if (durationSeconds <= 0 || distanceMeters <= 0) return durationSeconds;
  const miles = distanceMeters / METERS_PER_MILE;
  const hours = durationSeconds / 3600;
  const mph = miles / hours;
  const SLOW_MPH = 30;
  const FAST_MPH = 55;
  const MAX_REDUCTION = 0.2; // up to 20% faster on highway-dominated trips
  let t = (mph - SLOW_MPH) / (FAST_MPH - SLOW_MPH);
  if (t < 0) t = 0;
  if (t > 1) t = 1;
  const factor = 1 - MAX_REDUCTION * t;
  return durationSeconds * factor;
}

let storeRef: Store | null | undefined;
function getCacheStore(): Store | null {
  if (storeRef !== undefined) return storeRef;
  try {
    storeRef = getStore("route-distance-cache");
  } catch {
    storeRef = null;
  }
  return storeRef;
}

async function getCached(from: Coord, to: Coord): Promise<RouteResult | null> {
  const store = getCacheStore();
  if (!store) return null;
  try {
    const v = (await store.get(cacheKey(from, to), { type: "json" })) as
      | RouteResult
      | null;
    if (v && typeof v.miles === "number" && typeof v.hours === "number") return v;
    return null;
  } catch {
    return null;
  }
}

async function setCached(from: Coord, to: Coord, value: RouteResult): Promise<void> {
  const store = getCacheStore();
  if (!store) return;
  try {
    await store.setJSON(cacheKey(from, to), value);
  } catch {
    // Cache write failures are non-fatal.
  }
}

async function fetchOSRMRoute(from: Coord, to: Coord): Promise<RouteResult | null> {
  const url = `${OSRM_BASE}/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false&alternatives=false&steps=false`;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: { "User-Agent": "warmroad-route-distance/1.0" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      routes?: Array<{ distance?: number; duration?: number }>;
    };
    const route = data.routes?.[0];
    if (!route || typeof route.distance !== "number" || typeof route.duration !== "number") {
      return null;
    }
    return {
      miles: route.distance / METERS_PER_MILE,
      hours: calibrateDuration(route.distance, route.duration) / 3600,
    };
  } catch {
    return null;
  }
}

async function fetchOSRMTable(
  from: Coord,
  dests: Coord[]
): Promise<(RouteResult | null)[]> {
  if (dests.length === 0) return [];
  const coordStr = [from, ...dests].map((c) => `${c.lon},${c.lat}`).join(";");
  const url = `${OSRM_BASE}/table/v1/driving/${coordStr}?sources=0&annotations=distance,duration`;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(20000),
      headers: { "User-Agent": "warmroad-route-distance/1.0" },
    });
    if (!res.ok) return dests.map(() => null);
    const data = (await res.json()) as {
      distances?: number[][];
      durations?: number[][];
    };
    const distances = data.distances?.[0];
    const durations = data.durations?.[0];
    if (!distances || !durations) return dests.map(() => null);
    return dests.map((_, i) => {
      const d = distances[i + 1];
      const t = durations[i + 1];
      if (typeof d !== "number" || typeof t !== "number") return null;
      return { miles: d / METERS_PER_MILE, hours: calibrateDuration(d, t) / 3600 };
    });
  } catch {
    return dests.map(() => null);
  }
}

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const from = (body as { from?: unknown }).from;
  const to = (body as { to?: unknown }).to;
  if (!isValidCoord(from)) {
    return NextResponse.json({ error: "Invalid 'from' coordinate" }, { status: 400 });
  }

  if (Array.isArray(to)) {
    const valid = to.filter(isValidCoord) as Coord[];
    const cached = await Promise.all(valid.map((d) => getCached(from, d)));
    const missingIdx: number[] = [];
    cached.forEach((c, i) => {
      if (!c) missingIdx.push(i);
    });

    const fresh = new Map<number, RouteResult | null>();
    if (missingIdx.length > 0) {
      const CHUNK = 90; // OSRM public table demo accepts ~100 coords per request
      for (let i = 0; i < missingIdx.length; i += CHUNK) {
        const idxChunk = missingIdx.slice(i, i + CHUNK);
        const coordChunk = idxChunk.map((idx) => valid[idx]);
        const results = await fetchOSRMTable(from, coordChunk);
        await Promise.all(
          results.map((r, j) =>
            r ? setCached(from, coordChunk[j], r) : Promise.resolve()
          )
        );
        idxChunk.forEach((idx, j) => fresh.set(idx, results[j] ?? null));
      }
    }

    const out = cached.map((c, i) => c ?? fresh.get(i) ?? null);
    return NextResponse.json({ results: out });
  }

  if (!isValidCoord(to)) {
    return NextResponse.json({ error: "Invalid 'to' coordinate" }, { status: 400 });
  }

  const hit = await getCached(from, to);
  if (hit) return NextResponse.json(hit);

  const fresh = await fetchOSRMRoute(from, to);
  if (!fresh) {
    return NextResponse.json({ error: "Routing service unavailable" }, { status: 502 });
  }
  await setCached(from, to, fresh);
  return NextResponse.json(fresh);
}
