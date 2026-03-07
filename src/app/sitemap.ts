import type { MetadataRoute } from "next";
import { destinations } from "@/lib/destinations";
import { getAllCitySlugs } from "@/lib/road-trip-data";
import { getAllWarmPlacesSlugs } from "@/lib/warm-places-data";
import { getAllMotorcycleSlugs } from "@/lib/motorcycle-data";

const BASE_URL = "https://warmroad.com";

const springBreakCities = [
  "buffalo",
  "chicago",
  "cleveland",
  "columbus",
  "des-moines",
  "detroit",
  "indianapolis",
  "kansas-city",
  "milwaukee",
  "minneapolis",
  "pittsburgh",
  "st-louis",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split("T")[0];

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: today, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/road-trip-ideas`, lastModified: today, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/route-weather`, lastModified: today, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/motorcycle-road-trips`, lastModified: today, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: today, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/android`, lastModified: today, changeFrequency: "monthly", priority: 0.4 },
  ];

  // Road trip detail pages
  const roadTripPages: MetadataRoute.Sitemap = getAllCitySlugs().map((slug) => ({
    url: `${BASE_URL}/road-trip-ideas/${slug}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Route weather pages for all destinations
  const routeWeatherPages: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${BASE_URL}/route-weather/${dest.id}`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Warm places to drive pages
  const warmPlacesPages: MetadataRoute.Sitemap = getAllWarmPlacesSlugs().map((slug) => ({
    url: `${BASE_URL}/warm-places-to-drive/${slug}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Motorcycle road trip detail pages
  const motorcyclePages: MetadataRoute.Sitemap = getAllMotorcycleSlugs().map((slug) => ({
    url: `${BASE_URL}/motorcycle-road-trips/${slug}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Spring break pages (static HTML in public/)
  const springBreakPages: MetadataRoute.Sitemap = springBreakCities.map((city) => ({
    url: `${BASE_URL}/spring-break-road-trips-from-${city}`,
    lastModified: today,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...roadTripPages,
    ...routeWeatherPages,
    ...warmPlacesPages,
    ...motorcyclePages,
    ...springBreakPages,
  ];
}
