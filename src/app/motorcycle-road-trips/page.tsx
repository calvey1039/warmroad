import Link from "next/link";
import { getAllMotorcycleTrips } from "@/lib/motorcycle-data";

export default function MotorcycleRoadTripsPage() {
  const trips = getAllMotorcycleTrips();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/road-trip-ideas"
        className="text-sm text-orange-600 hover:text-orange-700 mb-8 inline-block"
      >
        &larr; Back to Road Trip Ideas
      </Link>

      <h1 className="text-3xl font-bold text-zinc-900 mb-3">
        Motorcycle Road Trip Guides
      </h1>
      <p className="text-zinc-600 text-sm leading-relaxed mb-8">
        The best motorcycle rides in America — from sweeping mountain parkways
        to twisting canyon roads. Use Warm Road to check weather and road
        conditions before you ride.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {trips.map((trip) => (
          <Link
            key={trip.slug}
            href={`/motorcycle-road-trips/${trip.slug}`}
            className="p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
          >
            <h2 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
              {trip.title}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Motorcycle ride guide
            </p>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 justify-center">
        <Link
          href="/"
          className="inline-block px-6 py-2.5 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Check Route Weather
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
