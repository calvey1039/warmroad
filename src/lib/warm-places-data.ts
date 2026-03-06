import warmFromCities from "../../data/warmFromCities.json";
import warmFromCleveland from "../../data/warmFromCleveland.json";

export interface WarmDestination {
  name: string;
  state: string;
  driveTime: string;
  description: string;
}

export interface WarmPlacesCity {
  city: string;
  slug: string;
  intro: string;
  destinations: WarmDestination[];
  weatherSection: string;
  toolSection: string;
  seoTitle: string;
  seoDescription: string;
}

const clevelandData = warmFromCleveland as {
  title: string;
  slug: string;
  intro: string;
  destinations: WarmDestination[];
  weatherSection: string;
  toolSection: string;
  seoTitle: string;
  seoDescription: string;
};

const allCities: WarmPlacesCity[] = [
  ...(warmFromCities as WarmPlacesCity[]),
  {
    city: "Cleveland",
    slug: clevelandData.slug,
    intro: clevelandData.intro,
    destinations: clevelandData.destinations,
    weatherSection: clevelandData.weatherSection,
    toolSection: clevelandData.toolSection,
    seoTitle: clevelandData.seoTitle,
    seoDescription: clevelandData.seoDescription,
  },
];

export function getWarmPlacesCity(slug: string): WarmPlacesCity | undefined {
  return allCities.find((c) => c.slug === `warm-places-to-drive-from-${slug}`);
}

export function getAllWarmPlacesSlugs(): string[] {
  return allCities.map((c) => c.slug.replace("warm-places-to-drive-from-", ""));
}

export function getAllWarmPlacesCities(): WarmPlacesCity[] {
  return allCities;
}
