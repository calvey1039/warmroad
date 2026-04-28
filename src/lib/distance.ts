// Calculate distance between two coordinates using Haversine formula
// A road detour factor of 1.35 is applied to approximate actual driving
// distance, since roads don't follow straight lines between two points.

export const DEFAULT_MPG = 25;
export const DEFAULT_GAS_PRICE = 4.03;
const ROAD_DETOUR_FACTOR = 1.35;

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
  return straightLineDistance * ROAD_DETOUR_FACTOR;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Estimate drive time based on distance
export function estimateDriveTime(distanceMiles: number): number {
  const avgSpeed = 55; // mph including traffic and breaks
  return distanceMiles / avgSpeed;
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
    const hoursFromStart = distFromStart / 55;

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
