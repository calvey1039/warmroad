import Link from "next/link";
import { featuredTrips, cityTrips } from "@/lib/road-trip-data";
import { getAllWarmPlacesCities } from "@/lib/warm-places-data";
import { getAllMotorcycleTrips } from "@/lib/motorcycle-data";
import { getAllWarmLandingPages } from "@/lib/warm-places-landing-data";

export default function RoadTripIdeasPage() {
  const warmPlacesCities = getAllWarmPlacesCities();
  const motorcycleTrips = getAllMotorcycleTrips();
  const warmLandingPages = getAllWarmLandingPages();

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

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          Discover Road Trip Ideas Based on Weather
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed">
          Looking for road trip ideas that match the weather you want? WarmRoad helps
          travelers discover warm road trips by connecting destinations with real-time
          forecasts and driving conditions. Whether you are planning a spring break
          getaway, a long weekend escape, or a week-long adventure, our tools make it
          easy to find warm destinations within driving distance of your home city.
          Browse curated routes from cities across the Midwest, Northeast, and beyond,
          and compare weather forecasts before you commit to a destination. WarmRoad
          takes the guesswork out of weather based road trip planning by showing you
          exactly what conditions to expect along your route. From sunny coastal highways
          to desert drives, we help you plan spring break and weekend trips with
          confidence. Check weather along your route using our{" "}
          <Link href="/route-weather" className="text-orange-600 hover:text-orange-700 underline">
            route weather tool
          </Link>
          , or start exploring the road trip ideas below to find your next warm-weather
          drive.
        </p>
      </section>

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

      <h2 className="text-2xl font-bold text-zinc-900 mb-2">
        Spring Break Road Trips
      </h2>
      <p className="text-zinc-600 text-sm leading-relaxed mb-6">
        Planning a spring break getaway? Browse warm road trip ideas from these
        northern US cities.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {[
          { city: "Chicago", slug: "chicago" },
          { city: "Cleveland", slug: "cleveland" },
          { city: "Detroit", slug: "detroit" },
          { city: "Columbus", slug: "columbus" },
          { city: "Pittsburgh", slug: "pittsburgh" },
          { city: "Indianapolis", slug: "indianapolis" },
          { city: "Milwaukee", slug: "milwaukee" },
          { city: "Minneapolis", slug: "minneapolis" },
          { city: "Buffalo", slug: "buffalo" },
          { city: "St. Louis", slug: "st-louis" },
          { city: "Kansas City", slug: "kansas-city" },
          { city: "Des Moines", slug: "des-moines" },
        ].map((item) => (
          <a
            key={item.slug}
            href={`/spring-break-road-trips-from-${item.slug}.html`}
            className="p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
              Spring Break from {item.city}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Warm destinations within driving distance
            </p>
          </a>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-zinc-900 mb-2">
        Warm Places to Drive
      </h2>
      <p className="text-zinc-600 text-sm leading-relaxed mb-6">
        Short warm-weather getaways within a day&apos;s drive from major
        northern cities.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {warmPlacesCities.map((city) => (
          <Link
            key={city.slug}
            href={`/warm-places-to-drive/${city.slug.replace("warm-places-to-drive-from-", "")}`}
            className="p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
              Warm Places to Drive From {city.city}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {city.destinations.length} destinations within driving distance
            </p>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-zinc-900 mb-2">
        Warm Places to Drive by City
      </h2>
      <p className="text-zinc-600 text-sm leading-relaxed mb-6">
        Find warm destinations within driving distance of major northern US
        cities.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {warmLandingPages.map((page) => (
          <Link
            key={page.slug}
            href={`/${page.slug}`}
            className="p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
              Warm Places From {page.city}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {page.destinations.length} warm destinations within driving
              distance
            </p>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-zinc-900 mb-2">
        Motorcycle Road Trips
      </h2>
      <p className="text-zinc-600 text-sm leading-relaxed mb-6">
        The best motorcycle rides in America — scenic routes, canyon roads, and
        parkways built for two wheels.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {motorcycleTrips.map((trip) => (
          <Link
            key={trip.slug}
            href={`/motorcycle-road-trips/${trip.slug}`}
            className="p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors group"
          >
            <h3 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
              {trip.title}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Motorcycle ride guide
            </p>
          </Link>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          Find Road Trip Ideas From Popular Cities
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
          Many travelers start road trip planning from their home city, searching for
          warm destinations they can reach by car. Whether you live in the Midwest or
          along the East Coast, these popular departure cities offer a great starting
          point. Each guide features curated spring break routes, estimated drive times,
          and weather-friendly destinations within a day or two of driving.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { city: "Chicago", slug: "chicago" },
            { city: "Cleveland", slug: "cleveland" },
            { city: "Detroit", slug: "detroit" },
            { city: "New York", slug: "new-york" },
            { city: "Philadelphia", slug: "philadelphia" },
            { city: "Boston", slug: "boston" },
          ].map((item) => (
            <li key={item.slug}>
              <a
                href={`/spring-break-road-trips-from-${item.slug}`}
                className="text-orange-600 hover:text-orange-700 underline text-sm"
              >
                Spring Break Road Trips from {item.city}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          Seasonal Road Trip Ideas
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
          The best road trips often depend on the season and weather. Spring brings mild
          temperatures perfect for coastal drives, while summer opens up mountain passes
          and northern routes. Fall delivers stunning foliage along scenic highways.
          Explore our seasonal road trip guides to find destinations that offer the best
          driving conditions for your travel window.
        </p>
        <ul className="space-y-2">
          <li>
            <a
              href="/spring-break-road-trips"
              className="text-orange-600 hover:text-orange-700 underline text-sm"
            >
              Spring Break Road Trips
            </a>
          </li>
          <li>
            <a
              href="/memorial-day-road-trips"
              className="text-orange-600 hover:text-orange-700 underline text-sm"
            >
              Memorial Day Road Trips
            </a>
          </li>
          <li>
            <a
              href="/summer-road-trips"
              className="text-orange-600 hover:text-orange-700 underline text-sm"
            >
              Summer Road Trips
            </a>
          </li>
          <li>
            <a
              href="/fall-road-trips"
              className="text-orange-600 hover:text-orange-700 underline text-sm"
            >
              Fall Road Trips
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          Specialty Road Trip Ideas
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
          Some travelers search for specific types of drives rather than a particular
          destination. Whether you prefer the open-air freedom of a motorcycle ride along
          winding roads, scenic drives through national parks and coastal highways, or
          mountain routes with dramatic elevation changes, these specialty collections
          help you find the right kind of trip.
        </p>
        <ul className="space-y-2">
          <li>
            <Link
              href="/motorcycle-road-trips"
              className="text-orange-600 hover:text-orange-700 underline text-sm"
            >
              Motorcycle Road Trips
            </Link>
          </li>
          <li>
            <a
              href="/scenic-drives"
              className="text-orange-600 hover:text-orange-700 underline text-sm"
            >
              Scenic Drives
            </a>
          </li>
          <li>
            <a
              href="/mountain-road-trips"
              className="text-orange-600 hover:text-orange-700 underline text-sm"
            >
              Mountain Road Trips
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          Plan Your Trip With Weather
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
          Before you hit the road, check the weather along your entire route. Knowing
          what conditions to expect helps you pack the right gear, avoid storms, and
          choose the best days to travel. WarmRoad&#39;s{" "}
          <Link href="/route-weather" className="text-orange-600 hover:text-orange-700 underline">
            route weather tool
          </Link>{" "}
          gives you a detailed forecast for every stop on your drive. Enter your starting
          city and destination, and see temperature, precipitation, and wind conditions
          mapped along your route. Whether you are driving south for spring break or
          exploring scenic highways in the summer, checking the forecast ahead of time
          helps you drive safe and enjoy the trip.
        </p>
      </section>

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
