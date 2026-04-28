"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { destinations } from "@/lib/destinations";
import { getWeatherForLocation, type WeatherData } from "@/lib/weather";
import {
  calculateDistance,
  estimateDriveTime,
  formatDriveTime,
} from "@/lib/distance";

interface NearbyDestination {
  id: string;
  name: string;
  state: string;
  description: string;
  driveTime: number;
  weather: WeatherData | null;
}

export default function CityOriginResults({
  cityName,
  stateAbbr,
  lat,
  lon,
}: {
  cityName: string;
  stateAbbr: string;
  lat: number;
  lon: number;
}) {
  const [nearby, setNearby] = useState<NearbyDestination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchResults() {
      // Calculate distances and filter to within 6 hours, excluding the origin city itself
      const withDistance = destinations
        .map((dest) => {
          const dist = calculateDistance(lat, lon, dest.lat, dest.lon);
          const driveTime = estimateDriveTime(dist);
          return { ...dest, driveTime, dist };
        })
        .filter((d) => d.driveTime <= 6 && d.driveTime > 0.25)
        .sort((a, b) => a.driveTime - b.driveTime);

      // Take top 6 destinations, preferring larger cities
      const top = withDistance
        .sort((a, b) => b.population - a.population)
        .slice(0, 6)
        .sort((a, b) => a.driveTime - b.driveTime);

      // Fetch weather for each
      const results: NearbyDestination[] = [];
      for (const dest of top) {
        if (cancelled) return;
        let weather: WeatherData | null = null;
        try {
          weather = await getWeatherForLocation(dest.lat, dest.lon);
        } catch {
          // Weather fetch failed, continue without it
        }
        results.push({
          id: dest.id,
          name: dest.name,
          state: dest.state,
          description: dest.description,
          driveTime: dest.driveTime,
          weather,
        });
      }

      if (!cancelled) {
        setNearby(results);
        setLoading(false);
      }
    }

    fetchResults();
    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  const encodedCity = encodeURIComponent(`${cityName}, ${stateAbbr}`);

  if (loading) {
    return (
      <div className="space-y-4 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 bg-zinc-50 rounded-lg animate-pulse">
            <div className="h-5 bg-zinc-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-zinc-200 rounded w-1/4 mb-3" />
            <div className="h-4 bg-zinc-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (nearby.length === 0) {
    return (
      <p className="text-zinc-500 text-sm mb-10">
        No destinations found within 6 hours of {cityName}. Try the full search
        tool for more options.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-4 mb-10">
        {nearby.map((dest) => (
          <div key={dest.id} className="p-5 bg-zinc-50 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                  {dest.name}, {dest.state}
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-orange-600 font-medium">
                    {formatDriveTime(dest.driveTime)} drive
                  </span>
                  {dest.weather && (
                    <span className="text-xs text-zinc-500">
                      {dest.weather.icon} {dest.weather.maxTemp}&deg;F &mdash;{" "}
                      {dest.weather.condition}
                    </span>
                  )}
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {dest.description}
                </p>
              </div>
              <Link
                href={`/route-weather/${dest.id}`}
                className="shrink-0 text-xs text-orange-600 hover:text-orange-700 underline mt-1"
              >
                Route weather &rarr;
              </Link>
            </div>

            {/* Affiliate lodging links */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-100">
              <span className="text-[11px] text-zinc-400 font-medium">
                Book:
              </span>
              <a
                href={`https://expedia.com/affiliate/xgQWywk?destination=${encodeURIComponent(`${dest.name}, ${dest.state}`)}&rooms=1&adults=2`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-zinc-500 hover:text-orange-600 transition-colors"
              >
                Expedia
              </a>
              <a
                href={`https://www.vrbo.com/search?destination=${encodeURIComponent(`${dest.name}, ${dest.state}`)}&adults=2&affcid=ncpxw7r`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-zinc-500 hover:text-orange-600 transition-colors"
              >
                VRBO
              </a>
              <a
                href={`https://www.awin1.com/cread.php?awinmid=6776&awinaffid=2785874&ued=${encodeURIComponent(`https://www.booking.com/searchresults.html?ss=${dest.name}, ${dest.state}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-zinc-500 hover:text-orange-600 transition-colors"
              >
                Booking.com
              </a>
              <a
                href={`https://www.hotels.com/Hotel-Search?destination=${encodeURIComponent(`${dest.name}, ${dest.state}`)}&rooms=1&adults=2&affcid=FpWwOIV`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-zinc-500 hover:text-orange-600 transition-colors"
              >
                Hotels.com
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
