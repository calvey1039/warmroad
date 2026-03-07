import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { destinations } from "@/lib/destinations";
import { getRouteWeatherSEO } from "@/lib/route-weather-seo-data";
import RouteWeatherTool from "@/components/RouteWeatherTool";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return destinations.map((dest) => ({ id: dest.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const dest = destinations.find((d) => d.id === id);
  if (!dest) return {};

  return {
    title: `Route Weather to ${dest.name}, ${dest.state} - Warm Road`,
    description: `Check the weather along your drive to ${dest.name}, ${dest.state}. See hour-by-hour forecasts at stops along the route to plan your road trip.`,
  };
}

export default async function RouteWeatherPage({ params }: PageProps) {
  const { id } = await params;
  const destination = destinations.find((d) => d.id === id);

  if (!destination) {
    notFound();
  }

  const seo = getRouteWeatherSEO(id);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="border-b border-zinc-100 dark:border-zinc-800 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-orange-600 transition-colors mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Warm Road
          </Link>
          <h1 className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Route Weather to {destination.name}, {destination.state}
          </h1>
        </div>
      </header>

      <div className="px-4 md:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* SEO intro content - server rendered */}
          {seo && (
            <div className="mb-8">
              {seo.intro.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Interactive route weather tool - client rendered */}
          <Suspense fallback={
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-zinc-300 border-t-orange-500 rounded-full animate-spin" />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading route weather tool...</span>
              </div>
            </div>
          }>
            <RouteWeatherTool destId={id} />
          </Suspense>

          {/* SEO content below the tool - server rendered */}
          {seo && (
            <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                  Typical Weather Along the Route to {destination.name}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {seo.weatherDescription}
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                  Best Seasons to Drive to {destination.name}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {seo.bestSeasons}
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                  Plan Your Drive
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Use the route weather tool above to check the forecast along your specific route to {destination.name}, {destination.state}. Enter your starting location to see the distance, estimated drive time, and weather at multiple stops between your origin and destination. You can adjust the departure date and time to find the best window for your trip.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/route-weather"
                    className="text-sm text-orange-600 hover:text-orange-700 underline"
                  >
                    Check any route
                  </Link>
                  <Link
                    href="/road-trip-ideas"
                    className="text-sm text-orange-600 hover:text-orange-700 underline"
                  >
                    Road trip ideas
                  </Link>
                  <Link
                    href="/"
                    className="text-sm text-orange-600 hover:text-orange-700 underline"
                  >
                    Find warm destinations
                  </Link>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
