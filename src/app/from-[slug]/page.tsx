import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCityOrigin,
  getAllCityOriginSlugs,
} from "@/lib/city-origin-data";
import CityOriginResults from "@/components/CityOriginResults";

export function generateStaticParams() {
  return getAllCityOriginSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityOrigin(slug);
  if (!city) return {};

  const cityLabel = `${city.name}, ${city.stateAbbr}`;

  return {
    title: `Best Weekend Road Trips From ${cityLabel} | WarmRoad`,
    description: `Find destinations with ideal weather within driving distance of ${cityLabel}. Plan an easy road trip with WarmRoad.`,
  };
}

export default async function CityOriginPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = getCityOrigin(slug);
  if (!city) notFound();

  const cityLabel = `${city.name}, ${city.stateAbbr}`;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-sm text-orange-600 hover:text-orange-700 mb-8 inline-block"
      >
        &larr; Back to WarmRoad
      </Link>

      <h1 className="text-3xl font-bold text-zinc-900 mb-6">
        Best Road Trips From {cityLabel} With Great Weather
      </h1>

      <p className="text-zinc-600 text-sm leading-relaxed mb-4">
        WarmRoad helps you find destinations with ideal weather within driving
        distance of {cityLabel}. Whether you&apos;re looking for a quick weekend
        escape or a longer road trip, we show you where the best weather is right
        now&mdash;no guessing, no wasted drives.
      </p>
      <p className="text-zinc-600 text-sm leading-relaxed mb-8">
        Below are top destinations within about 6 hours of {city.name}, along
        with current weather conditions and drive times. Pick a spot, check the
        route weather, and hit the road.
      </p>

      <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
        Top Destinations Near {city.name}
      </h2>

      <Suspense
        fallback={
          <div className="space-y-4 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-5 bg-zinc-50 rounded-lg animate-pulse"
              >
                <div className="h-5 bg-zinc-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-zinc-200 rounded w-1/4 mb-3" />
                <div className="h-4 bg-zinc-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        }
      >
        <CityOriginResults
          cityName={city.name}
          stateAbbr={city.stateAbbr}
          lat={city.lat}
          lon={city.lon}
        />
      </Suspense>

      <div className="p-5 bg-orange-50 border border-orange-100 rounded-lg mb-8">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          Find Your Ideal Weather Road Trip
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed mb-3">
          Want to see more destinations or adjust your search radius? Use
          WarmRoad&apos;s full search tool to explore every option from{" "}
          {cityLabel} with real-time weather data, drive time estimates, and
          lodging prices.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Find Your Ideal Weather Road Trip
        </Link>
      </div>

      <div className="p-5 bg-zinc-50 rounded-lg mb-8">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          Check Weather Along Your Route
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed mb-3">
          Before hitting the road from {city.name}, use WarmRoad&apos;s route
          weather tool to see real-time conditions along your entire drive. Know
          what to expect mile by mile so you can plan the best day to leave.
        </p>
        <Link
          href="/route-weather"
          className="inline-block px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Check Route Weather
        </Link>
      </div>

      <div className="flex items-center gap-4 justify-center">
        <Link
          href="/"
          className="inline-block px-6 py-2.5 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Plan Your Trip on WarmRoad
        </Link>
        <Link
          href="/road-trip-ideas"
          className="inline-block px-6 py-2.5 text-sm font-medium bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          More Road Trip Ideas
        </Link>
      </div>
    </div>
  );
}
