import Link from "next/link";
import { featuredTrips, cityTrips } from "@/lib/road-trip-data";

export default function RoadTripIdeasPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-sm text-orange-600 hover:text-orange-700 mb-8 inline-block"
      >
        &larr; Back to Warm Road
      </Link>
      <h1 className="text-3xl font-bold text-zinc-900 mb-3">Road Trip Ideas</h1>
      <p className="text-zinc-600 text-sm leading-relaxed mb-8">
        Curated warm-weather road trip routes across the United States. Use Warm
        Road to check current weather conditions and plan your drive.
      </p>

      <div className="space-y-5 mb-12">
        {featuredTrips.map((trip) => (
          <div key={trip.name} className="p-5 bg-zinc-50 rounded-lg">
            <h2 className="text-lg font-semibold text-zinc-900 mb-1">
              {trip.name}
            </h2>
            <p className="text-xs text-orange-600 font-medium mb-2">
              {trip.route}
            </p>
            <p className="text-zinc-600 text-sm leading-relaxed mb-3">
              {trip.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span>
                <span className="font-medium text-zinc-700">Best for:</span>{" "}
                {trip.bestFor}
              </span>
              <span>
                <span className="font-medium text-zinc-700">Season:</span>{" "}
                {trip.season}
              </span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-zinc-900 mb-2">
        Warm Road Trips by City
      </h2>
      <p className="text-zinc-600 text-sm leading-relaxed mb-6">
        Routes from major northern US cities to warm-weather destinations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {cityTrips.map((city) => (
          <Link
            key={city.slug}
            href={`/road-trip-ideas/${city.slug}`}
            className="p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
              From {city.city}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {city.routes.length} routes
            </p>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="inline-block px-6 py-2.5 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Plan Your Trip on Warm Road
        </Link>
      </div>
    </div>
  );
}
