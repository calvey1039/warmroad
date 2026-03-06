import motorcycleTrips from "../../data/motorcycleTrips.json";

export interface MotorcycleTrip {
  title: string;
  slug: string;
  intro: string;
  routeHighlights: string[];
  bestSeason: string;
  whyGoodForMotorcycles: string;
  seoTitle: string;
  seoDescription: string;
}

const allTrips: MotorcycleTrip[] = motorcycleTrips as MotorcycleTrip[];

export function getMotorcycleTrip(slug: string): MotorcycleTrip | undefined {
  return allTrips.find((t) => t.slug === slug);
}

export function getAllMotorcycleSlugs(): string[] {
  return allTrips.map((t) => t.slug);
}

export function getAllMotorcycleTrips(): MotorcycleTrip[] {
  return allTrips;
}
