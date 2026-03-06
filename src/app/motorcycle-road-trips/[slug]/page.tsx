import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getMotorcycleTrip,
  getAllMotorcycleSlugs,
} from "@/lib/motorcycle-data";

export function generateStaticParams() {
  return getAllMotorcycleSlugs().map((slug) => ({ slug }));
}

export default async function MotorcycleTripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getMotorcycleTrip(slug);

  if (!trip) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/motorcycle-road-trips"
        className="text-sm text-orange-600 hover:text-orange-700 mb-8 inline-block"
      >
        &larr; Back to Motorcycle Road Trips
      </Link>

      <h1 className="text-3xl font-bold text-zinc-900 mb-4">{trip.title}</h1>
      <p className="text-zinc-600 text-sm leading-relaxed mb-8">{trip.intro}</p>

      <h2 className="text-2xl font-bold text-zinc-900 mb-4">
        Route Highlights
      </h2>
      <div className="space-y-3 mb-10">
        {trip.routeHighlights.map((highlight, idx) => (
          <div key={idx} className="p-4 bg-zinc-50 rounded-lg">
            <p className="text-zinc-600 text-sm leading-relaxed">{highlight}</p>
          </div>
        ))}
      </div>

      <div className="p-5 bg-zinc-50 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          Best Season to Ride
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed">
          {trip.bestSeason}
        </p>
      </div>

      <div className="p-5 bg-zinc-50 rounded-lg mb-10">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          Why Riders Love This Route
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed">
          {trip.whyGoodForMotorcycles}
        </p>
      </div>

      <div className="flex items-center gap-4 justify-center">
        <Link
          href="/"
          className="inline-block px-6 py-2.5 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Check Route Weather
        </Link>
        <Link
          href="/motorcycle-road-trips"
          className="inline-block px-6 py-2.5 text-sm font-medium bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          More Motorcycle Rides
        </Link>
      </div>
    </div>
  );
}
