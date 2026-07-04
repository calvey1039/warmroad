import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://warmroad.com";
const PAGE_URL = `${BASE_URL}/road-trip-ideas/beat-the-heat`;

export const metadata: Metadata = {
  title: "Beat the Heat Road Trips | Find Cooler Destations Near You | WarmRoad",
  description:
    "Escape the summer heat with WarmRoad. Discover cooler destinations within driving distance based on your preferred temperature.",
  alternates: {
    canonical: "/road-trip-ideas/beat-the-heat",
  },
};

const destinationSections = [
  {
    title: "Mountain Destinations",
    body: "Mountain road trips are one of the most reliable ways to escape the summer heat because temperatures often drop as elevation rises. Look for national park gateway towns, Blue Ridge overlooks, Rocky Mountain valleys, and shaded Appalachian routes where mornings and evenings can feel dramatically cooler than nearby cities.",
  },
  {
    title: "Great Lakes Destinations",
    body: "The Great Lakes can moderate summer temperatures and create comfortable road trip stops near beaches, harbor towns, islands, and lakefront trails. For Midwest travelers, routes toward Lake Superior, northern Michigan, Door County, and western New York can offer cooler weather without requiring a flight.",
  },
  {
    title: "Higher Elevation Towns",
    body: "Higher elevation towns are often the best places to cool off this summer when nearby lowlands are stuck in extreme heat. Search for mountain communities, plateau towns, ski villages in their off-season, and scenic byways where a few hours of driving can change the forecast.",
  },
  {
    title: "Northern Forests",
    body: "Northern forests offer shaded drives, cooler nights, lakes, rivers, and campgrounds that feel more comfortable during a heat wave. The Northwoods, Adirondacks, Upper Peninsula, northern New England, and forested parts of the Pacific Northwest are strong candidates for cool weather road trips.",
  },
  {
    title: "Coastal Destinations",
    body: "Coastal destinations can be a smart summer escape where ocean or lake breezes keep temperatures more comfortable than inland areas. When applicable from your starting point, compare beaches, peninsulas, islands, and coastal towns against inland alternatives before choosing your route.",
  },
];

const faqs = [
  {
    question: "Where can I escape the summer heat?",
    answer:
      "You can often escape the summer heat by driving toward mountains, higher elevation towns, Great Lakes shorelines, northern forests, or breezy coastal destinations. WarmRoad helps you compare nearby destinations by forecast temperature so you can find cooler weather without flying.",
  },
  {
    question: "What are the coolest places within driving distance?",
    answer:
      "The coolest places within driving distance depend on your starting point, but good options often include mountain towns, lakefront communities, shaded forest regions, and northern destinations. Use WarmRoad to set your drive time and temperature range to find places that match your preferred weather.",
  },
  {
    question: "Where should I road trip during a heat wave?",
    answer:
      "During a heat wave, consider road trips to cooler weather in higher elevations, near large bodies of water, or farther north. Check both destination temperatures and route conditions before leaving, especially if storms or wildfire smoke are possible.",
  },
  {
    question: "How can I find cooler weather nearby?",
    answer:
      "Enter your starting location in WarmRoad, choose a comfortable temperature range such as 60°F to 75°F, and compare destinations within your preferred driving distance. The tool highlights places where the forecast fits your comfort range.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Road Trip Ideas",
        item: `${BASE_URL}/road-trip-ideas`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Beat the Heat Road Trips",
        item: PAGE_URL,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Beat the Heat: Find Cooler Destinations Within Driving Distance",
    description:
      "A WarmRoad guide to finding cooler summer road trips, mountain escapes, Great Lakes destinations, higher elevation towns, northern forests, and coastal routes.",
    url: PAGE_URL,
    mainEntityOfPage: PAGE_URL,
    publisher: {
      "@type": "Organization",
      name: "WarmRoad",
      url: BASE_URL,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
];

export default function BeatTheHeatRoadTripsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/road-trip-ideas"
        className="text-sm text-orange-600 hover:text-orange-700 mb-8 inline-block"
      >
        &larr; Back to Road Trip Ideas
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-4">
            Beat the Heat: Find Cooler Destinations Within Driving Distance
          </h1>
          <p className="text-zinc-600 text-sm leading-relaxed">
            WarmRoad helps travelers escape extreme summer temperatures by
            finding cooler destinations without flying. Enter your starting
            point, set a comfortable temperature range, and compare beat the
            heat road trips to mountains, lakes, forests, coasts, and higher
            elevation towns within driving distance.
          </p>
        </header>

        <section className="p-5 bg-zinc-50 rounded-lg mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 mb-2">
            Why Driving to Cooler Weather Can Be Cheaper Than Flying
          </h2>
          <p className="text-zinc-600 text-sm leading-relaxed">
            A flight can add airfare, airport parking, baggage fees, rental car
            costs, and rigid schedules before the trip even starts. A road trip
            lets you use your own vehicle, pack freely, split fuel costs across
            passengers, and adjust your route if the forecast changes. For many
            families and weekend travelers, the cheapest way to escape the
            summer heat is to search for places to cool off this summer within a
            manageable drive.
          </p>
        </section>

        <section className="space-y-6 mb-12" aria-labelledby="cooler-places">
          <div>
            <h2
              id="cooler-places"
              className="text-2xl font-bold text-zinc-900 mb-2"
            >
              Road Trips to Cooler Weather
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              The coolest places within driving distance vary by origin, but
              these destination types are a strong starting point when the
              forecast gets uncomfortable.
            </p>
          </div>

          {destinationSections.map((section) => (
            <section key={section.title} className="p-5 bg-zinc-50 rounded-lg">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                {section.title}
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
        </section>

        <section className="p-6 bg-orange-50 rounded-lg mb-12 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">
            Search for 60°F to 75°F Destinations
          </h2>
          <p className="text-zinc-600 text-sm leading-relaxed mb-5">
            Use WarmRoad to find cool weather road trips by selecting a
            comfortable temperature range between 60°F and 75°F, then compare
            destinations within the number of hours you want to drive.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-block px-6 py-2.5 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Find Cooler Destinations
            </Link>
            <Link
              href="/route-weather"
              className="inline-block px-6 py-2.5 text-sm font-medium bg-white text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Check Route Weather
            </Link>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="planning-links">
          <h2
            id="planning-links"
            className="text-2xl font-bold text-zinc-900 mb-4"
          >
            Plan a Cooler Summer Drive
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/"
              className="p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
            >
              <h3 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
                WarmRoad Search
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Find destinations by temperature and drive time
              </p>
            </Link>
            <Link
              href="/route-weather"
              className="p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
            >
              <h3 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
                Route Weather
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Check conditions before you leave
              </p>
            </Link>
            <Link
              href="/road-trip-ideas"
              className="p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
            >
              <h3 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
                Road Trip Ideas
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Browse more seasonal driving guides
              </p>
            </Link>
            <Link
              href="/"
              className="p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
            >
              <h3 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
                Favorite Destinations
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Save and share destinations from the main search
              </p>
            </Link>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-bold text-zinc-900 mb-4">
            Beat the Heat Road Trip FAQ
          </h2>
          <div className="space-y-5">
            {faqs.map((faq) => (
              <section key={faq.question} className="p-5 bg-zinc-50 rounded-lg">
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </section>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
