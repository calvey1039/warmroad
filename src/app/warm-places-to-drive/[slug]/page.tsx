import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getWarmPlacesCity,
  getAllWarmPlacesSlugs,
} from "@/lib/warm-places-data";

export function generateStaticParams() {
  return getAllWarmPlacesSlugs().map((slug) => ({ slug }));
}

function renderMarkdownLinks(text: string) {
  const parts = text.split(/(\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    const match = part.match(/\[(.*?)\]\((.*?)\)/);
    if (match) {
      return (
        <Link
          key={i}
          href={match[2]}
          className="text-orange-600 hover:text-orange-700 underline"
        >
          {match[1]}
        </Link>
      );
    }
    return part;
  });
}

export default async function WarmPlacesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = getWarmPlacesCity(slug);

  if (!city) {
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
        Warm Places to Drive From {city.city}
      </h1>
      <p className="text-zinc-600 text-sm leading-relaxed mb-8">
        {city.intro}
      </p>

      <h2 className="text-2xl font-bold text-zinc-900 mb-4">
        Top Destinations
      </h2>
      <div className="space-y-4 mb-10">
        {city.destinations.map((dest, idx) => (
          <div key={idx} className="p-5 bg-zinc-50 rounded-lg">
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">
              {dest.name}, {dest.state}
            </h3>
            <p className="text-xs text-orange-600 font-medium mb-2">
              Drive time: {dest.driveTime}
            </p>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {dest.description}
            </p>
          </div>
        ))}
      </div>

      <div className="p-5 bg-zinc-50 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          Check Weather Along Your Route
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed">
          {renderMarkdownLinks(city.weatherSection)}
        </p>
      </div>

      <div className="p-5 bg-zinc-50 rounded-lg mb-10">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          Find Your Warm Escape
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed">
          {renderMarkdownLinks(city.toolSection)}
        </p>
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
