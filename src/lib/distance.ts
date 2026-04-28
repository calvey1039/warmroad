// Drive distance and time estimates from straight-line (Haversine) coordinates.
//
// The road detour factor and average speed are not constants — they vary with
// trip length. Short trips spend a larger share of their miles on surface
// streets with stops and turns (high detour, low effective speed); long trips
// are dominated by interstate highway miles (low detour, high effective speed).
// Tiering both inputs on distance gives noticeably better estimates across the
// full range from intra-city drives to cross-country trips, while keeping the
// computation purely client-side.

export const DEFAULT_MPG = 25;
export const DEFAULT_GAS_PRICE = 4.03;

// Detour factor as a function of straight-line (haversine) miles.
// Surface streets and local roads dominate short trips; interstates dominate
// long trips and follow much straighter paths.
function getRoadDetourFactor(haversineMiles: number): number {
  if (haversineMiles < 15) return 1.4;
  if (haversineMiles < 50) return 1.25;
  if (haversineMiles < 150) return 1.18;
  if (haversineMiles < 400) return 1.13;
  return 1.1;
}

// Average drive speed (mph) as a function of road miles.
// Short trips average city-street speeds; long trips average interstate speeds.
function getAvgDriveSpeed(roadMiles: number): number {
  if (roadMiles < 20) return 30;
  if (roadMiles < 65) return 50;
  if (roadMiles < 180) return 58;
  if (roadMiles < 450) return 63;
  return 65;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineDistance = R * c;
  return straightLineDistance * getRoadDetourFactor(straightLineDistance);
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Estimate drive time (hours) from road miles using a distance-tiered speed.
export function estimateDriveTime(distanceMiles: number): number {
  return distanceMiles / getAvgDriveSpeed(distanceMiles);
}

export function formatDriveTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

// Calculate round-trip fuel cost
export function calculateFuelCost(distanceMiles: number, gasPrice: number, mpg: number): number {
  const roundTripMiles = distanceMiles * 2;
  const gallons = roundTripMiles / mpg;
  return gallons * gasPrice;
}

export function formatFuelCost(cost: number): string {
  return `$${cost.toFixed(0)}`;
}

// Waypoint along a route
export interface RouteWaypoint {
  lat: number;
  lon: number;
  hoursFromStart: number;
  label: string; // e.g. "Start", "1 hr", "2 hrs", "Destination"
  distanceFromStart: number; // miles from start
  estimatedHour: number; // hours from departure
}

// Interpolate waypoints along a route with dynamic point count
export function getRouteWaypoints(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number,
  originLabel: string = "Start",
  destLabel: string = "Destination",
  totalDistance?: number,
  intermediateCount: number = 5
): RouteWaypoint[] {
  const dist = totalDistance ?? calculateDistance(fromLat, fromLon, toLat, toLon);
  const totalHours = estimateDriveTime(dist);
  const waypoints: RouteWaypoint[] = [];
  const totalPoints = intermediateCount + 2; // include start and end

  for (let i = 0; i < totalPoints; i++) {
    const fraction = i / (totalPoints - 1);
    const lat = fromLat + (toLat - fromLat) * fraction;
    const lon = fromLon + (toLon - fromLon) * fraction;
    const distFromStart = dist * fraction;
    const hoursFromStart = totalHours * fraction;

    let label: string;
    if (i === 0) {
      label = originLabel;
    } else if (i === totalPoints - 1) {
      label = destLabel;
    } else {
      const hrs = Math.round(hoursFromStart);
      label = hrs === 1 ? "1 hr" : `${hrs} hrs`;
    }

    waypoints.push({
      lat,
      lon,
      hoursFromStart,
      label,
      distanceFromStart: Math.round(distFromStart),
      estimatedHour: hoursFromStart,
    });
  }

  return waypoints;
}
