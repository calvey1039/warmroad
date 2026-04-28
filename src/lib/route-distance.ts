// Client-side helpers for fetching real driving distance and time from
// /api/route-distance, which proxies a real routing engine and caches per
// origin/destination pair. Falls back to the haversine-based estimate from
// distance.ts if the API is unreachable.

import { calculateDistance, estimateDriveTime } from "./distance";

export interface DriveStats {
  miles: number;
  hours: number;
}

interface Coord {
  lat: number;
  lon: number;
}

function fallback(from: Coord, to: Coord): DriveStats {
  const miles = calculateDistance(from.lat, from.lon, to.lat, to.lon);
  return { miles, hours: estimateDriveTime(miles) };
}

export async function fetchDriveStats(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): Promise<DriveStats> {
  const from = { lat: fromLat, lon: fromLon };
  const to = { lat: toLat, lon: toLon };
  try {
    const res = await fetch("/api/route-distance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to }),
    });
    if (res.ok) {
      const data = (await res.json()) as Partial<DriveStats>;
      if (typeof data.miles === "number" && typeof data.hours === "number") {
        return { miles: data.miles, hours: data.hours };
      }
    }
  } catch {
    // Fall through to fallback.
  }
  return fallback(from, to);
}

export async function fetchDriveStatsBatch(
  from: Coord,
  to: Coord[]
): Promise<DriveStats[]> {
  if (to.length === 0) return [];
  try {
    const res = await fetch("/api/route-distance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to }),
    });
    if (res.ok) {
      const data = (await res.json()) as { results?: Array<Partial<DriveStats> | null> };
      if (Array.isArray(data.results) && data.results.length === to.length) {
        return data.results.map((r, i) => {
          if (r && typeof r.miles === "number" && typeof r.hours === "number") {
            return { miles: r.miles, hours: r.hours };
          }
          return fallback(from, to[i]);
        });
      }
    }
  } catch {
    // Fall through to fallback below.
  }
  return to.map((t) => fallback(from, t));
}
