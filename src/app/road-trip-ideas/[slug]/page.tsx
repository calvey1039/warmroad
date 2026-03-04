import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityTripBySlug, getAllCitySlugs } from "@/lib/road-trip-data";

export function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ slug }));
}

export default async function CityTripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cityTrip = getCityTripBySlug(slug);

  if (!cityTrip) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/road-trip-ideas"
        className="text-sm text-orange-600 hover:text-orange-700 mb-8 inline-block"
      >
        &larr; Back to Road Trip Ideas
      </Link>

      <h1 className="text-3xl font-bold text-zinc-900 mb-4">
        Warm Road Trips from {cityTrip.city}
      </h1>
      <p className="text-zinc-600 text-sm leading-relaxed mb-8">
        {cityTrip.intro}
      </p>

      <div className="space-y-6 mb-12">
        {cityTrip.routes.map((route, idx) => (
          <div key={idx} className="p-5 bg-zinc-50 rounded-lg">
            <h2 className="text-lg font-semibold text-zinc-900 mb-1">
              {route.name}
            </h2>
            <p className="text-xs text-orange-600 font-medium mb-2">
              {route.route}
            </p>
            <p className="text-zinc-600 text-sm leading-relaxed mb-3">
              {route.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
              <span>
                <span className="font-medium text-zinc-700">Best for:</span>{" "}
                {route.bestFor}
              </span>
              <span>
                <span className="font-medium text-zinc-700">Season:</span>{" "}
                {route.season}
              </span>
              <span>
                <span className="font-medium text-zinc-700">Drive time:</span>{" "}
                {route.driveTime}
              </span>
            </div>
          </div>
        ))}
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
