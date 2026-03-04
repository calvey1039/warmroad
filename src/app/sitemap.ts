import type { MetadataRoute } from "next";
import { destinations } from "@/lib/destinations";
import { getAllCitySlugs } from "@/lib/road-trip-data";

const BASE_URL = "https://warmroad.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split("T")[0];

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: today, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/road-trip-ideas`, lastModified: today, changeFrequency: "weekly", priority: 0.9 },
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

  return [...staticPages, ...roadTripPages, ...routeWeatherPages];
}
