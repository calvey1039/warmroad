import Link from "next/link";
import type { WarmLandingPage } from "@/lib/warm-places-landing-data";

export function WarmPlacesLanding({ page }: { page: WarmLandingPage }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/road-trip-ideas"
        className="text-sm text-orange-600 hover:text-orange-700 mb-8 inline-block"
      >
        &larr; Back to Road Trip Ideas
      </Link>

      <h1 className="text-3xl font-bold text-zinc-900 mb-6">
        Warm Places to Drive From {page.city}
      </h1>

      {page.introParagraphs.map((para, i) => (
        <p key={i} className="text-zinc-600 text-sm leading-relaxed mb-4">
          {para}
        </p>
      ))}

      <h2 className="text-2xl font-bold text-zinc-900 mt-8 mb-4">
        Warm Destinations Within Driving Distance
      </h2>

      <div className="space-y-4 mb-10">
        {page.destinations.map((dest, idx) => (
          <div key={idx} className="p-5 bg-zinc-50 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                  {dest.name}, {dest.state}
                </h3>
                <p className="text-xs text-orange-600 font-medium mb-2">
                  Drive time: {dest.driveTime}
                </p>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {dest.highlight}
                </p>
              </div>
              {dest.routeWeatherId && (
                <Link
                  href={`/route-weather/${dest.routeWeatherId}`}
                  className="shrink-0 text-xs text-orange-600 hover:text-orange-700 underline mt-1"
                >
                  Route weather &rarr;
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-orange-50 border border-orange-100 rounded-lg mb-8">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          Check Weather Along Your Route
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed mb-3">
          Before hitting the road from {page.city}, use WarmRoad&apos;s route
          weather tool to see real-time conditions along your entire drive.
          Know what to expect mile by mile so you can plan the best day to
          leave.
        </p>
        <Link
          href="/route-weather"
          className="inline-block px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Check Route Weather
        </Link>
      </div>

      <h2 className="text-lg font-semibold text-zinc-900 mb-3">
        More Road Trip Ideas
      </h2>
      <div className="space-y-2 mb-8">
        <Link
          href={`/road-trip-ideas/${page.relatedRoadTripSlug}`}
          className="block p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors text-sm text-zinc-700 hover:text-orange-600"
        >
          Warm Road Trips from {page.city} &rarr;
        </Link>
        {page.relatedWarmPlacesSlug && (
          <Link
            href={`/warm-places-to-drive/${page.relatedWarmPlacesSlug}`}
            className="block p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors text-sm text-zinc-700 hover:text-orange-600"
          >
            Warm Places to Drive From {page.city} — Detailed Guide &rarr;
          </Link>
        )}
        <Link
          href="/road-trip-ideas"
          className="block p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors text-sm text-zinc-700 hover:text-orange-600"
        >
          Browse All Road Trip Ideas &rarr;
        </Link>
      </div>

      <div className="flex items-center gap-4 justify-center">
        <Link
          href="/"
          className="inline-block px-6 py-2.5 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Plan Your Trip on Warm Road
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
