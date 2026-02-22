"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { destinations, type Destination } from "@/lib/destinations";
import { getWeatherForLocation, meetsTemperatureCriteria, type WeatherData } from "@/lib/weather";
import { calculateDistance, estimateDriveTime } from "@/lib/distance";
import { geocodeZipCode } from "@/lib/geocoding";
import DestinationCard from "@/components/DestinationCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic import for map to avoid SSR issues
const MapView = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-zinc-100 animate-pulse" />
  ),
});

interface DestinationWithData extends Destination {
  weather: WeatherData | null;
  driveTime: number;
  distance: number;
}

// Temperature filter options
type TempFilter = "60+" | "65+" | "70+" | "75+" | "below70" | "below75" | "below80" | "below85";

const tempFilterConfig: Record<TempFilter, { min: number | null; max: number | null; label: string }> = {
  "60+": { min: 60, max: null, label: "60°F+" },
  "65+": { min: 65, max: null, label: "65°F+" },
  "70+": { min: 70, max: null, label: "70°F+" },
  "75+": { min: 75, max: null, label: "75°F+" },
  "below70": { min: null, max: 70, label: "<70°F" },
  "below75": { min: null, max: 75, label: "<75°F" },
  "below80": { min: null, max: 80, label: "<80°F" },
  "below85": { min: null, max: 85, label: "<85°F" },
};

export default function Home() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );
  const [weatherData, setWeatherData] = useState<
    Record<string, WeatherData | null>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [maxDriveHours, setMaxDriveHours] = useState<8 | 10 | 12>(8);
  const [tempFilter, setTempFilter] = useState<TempFilter>("65+");
  const [zipCode, setZipCode] = useState("");
  const [isGeocodingZip, setIsGeocodingZip] = useState(false);

  // Request user location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationName("Your location");
        setIsLoading(false);
      },
      (error) => {
        console.error("Location error:", error);
        // Default to center of US if location denied
        setUserLocation({ lat: 39.8283, lon: -98.5795 });
        setLocationName("Central US");
        setLocationError(
          "Location access denied. Enter a zip code or showing from central US."
        );
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  }, []);

  // Handle zip code submission
  const handleZipCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim() || zipCode.length < 5) return;

    setIsGeocodingZip(true);
    setLocationError(null);

    const result = await geocodeZipCode(zipCode.trim());

    if (result) {
      setUserLocation({ lat: result.lat, lon: result.lon });
      setLocationName(`${result.name}${result.state ? `, ${result.state}` : ""}`);
      setWeatherData({}); // Clear existing weather data
      setLoadingWeather(true);
    } else {
      setLocationError("Could not find that zip code. Please try again.");
    }

    setIsGeocodingZip(false);
  };

  // Calculate destinations with drive times
  const destinationsWithDistance = useMemo(() => {
    if (!userLocation) return [];

    return destinations
      .map((dest) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          dest.lat,
          dest.lon
        );
        const driveTime = estimateDriveTime(distance);
        return {
          ...dest,
          distance,
          driveTime,
          weather: weatherData[dest.id] || null,
        };
      })
      .filter((dest) => dest.driveTime <= maxDriveHours)
      .sort((a, b) => a.driveTime - b.driveTime);
  }, [userLocation, weatherData, maxDriveHours]);

  // Get current filter config
  const currentFilter = tempFilterConfig[tempFilter];

  // Filter destinations based on temperature criteria
  const filteredDestinations = useMemo(() => {
    return destinationsWithDistance.filter((dest) =>
      meetsTemperatureCriteria(dest.weather, currentFilter.min, currentFilter.max)
    );
  }, [destinationsWithDistance, currentFilter]);

  // Fetch weather data for destinations within range
  useEffect(() => {
    if (!userLocation || destinationsWithDistance.length === 0) return;

    const fetchWeather = async () => {
      setLoadingWeather(true);
      const newWeatherData: Record<string, WeatherData | null> = {};

      // Fetch in batches to avoid rate limiting
      const batchSize = 5;
      for (let i = 0; i < destinationsWithDistance.length; i += batchSize) {
        const batch = destinationsWithDistance.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map((dest) => getWeatherForLocation(dest.lat, dest.lon))
        );

        batch.forEach((dest, idx) => {
          newWeatherData[dest.id] = results[idx];
        });

        // Small delay between batches
        if (i + batchSize < destinationsWithDistance.length) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      setWeatherData((prev) => ({ ...prev, ...newWeatherData }));
      setLoadingWeather(false);
    };

    fetchWeather();
  }, [userLocation, destinationsWithDistance.length]);

  const handleSelectDestination = useCallback((id: string) => {
    setSelectedDestination((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-6 py-4 border-b border-zinc-100">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" fill="currentColor" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
                </svg>
                WarmRoad
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                Find destinations within {maxDriveHours} hours
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Zip Code Input */}
            <form onSubmit={handleZipCodeSubmit} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  placeholder="Enter zip code"
                  className="w-32 px-3 py-1.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  maxLength={5}
                />
              </div>
              <button
                type="submit"
                disabled={zipCode.length < 5 || isGeocodingZip}
                className="px-3 py-1.5 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGeocodingZip ? "..." : "Go"}
              </button>
            </form>

            {locationName && (
              <div className="text-xs text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-full">
                From: {locationName}
              </div>
            )}

            {/* Temperature Filter Toggle */}
            <div className="flex items-center bg-zinc-100 rounded-full p-1">
              {(Object.keys(tempFilterConfig) as TempFilter[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setTempFilter(key)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                    tempFilter === key
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {tempFilterConfig[key].label}
                </button>
              ))}
            </div>

            {/* Drive Time Toggle */}
            <div className="flex items-center gap-1 bg-zinc-100 rounded-full p-1">
              <button
                onClick={() => setMaxDriveHours(8)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                  maxDriveHours === 8
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                8 hr
              </button>
              <button
                onClick={() => setMaxDriveHours(10)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                  maxDriveHours === 10
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                10 hr
              </button>
              <button
                onClick={() => setMaxDriveHours(12)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                  maxDriveHours === 12
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                12 hr
              </button>
            </div>

            {locationError && (
              <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                {locationError}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[420px] shrink-0 border-r border-zinc-100 flex flex-col bg-white">
          {/* Destinations list */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))
              ) : filteredDestinations.length === 0 && !loadingWeather ? (
                <div className="text-center py-12 px-6">
                  <div className="text-4xl mb-4">🌡️</div>
                  <h3 className="font-medium text-zinc-900 mb-2">
                    No matching destinations found
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    No destinations within {maxDriveHours} hours match "{currentFilter.label}" in the next 7 days. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                filteredDestinations.map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    id={dest.id}
                    name={dest.name}
                    state={dest.state}
                    description={dest.description}
                    weather={dest.weather}
                    driveTime={dest.driveTime}
                    tempFilter={currentFilter}
                    isSelected={selectedDestination === dest.id}
                    onSelect={() => handleSelectDestination(dest.id)}
                  />
                ))
              )}

              {loadingWeather && !isLoading && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-sm text-zinc-500">
                    <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                    Loading weather data...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <MapView
            userLocation={userLocation}
            destinations={destinationsWithDistance.map((d) => ({
              id: d.id,
              name: d.name,
              state: d.state,
              lat: d.lat,
              lon: d.lon,
              maxTemp: d.weather?.maxTemp,
              meetsFilter: meetsTemperatureCriteria(d.weather, currentFilter.min, currentFilter.max),
            }))}
            selectedDestination={selectedDestination}
            onSelectDestination={handleSelectDestination}
            filterLabel={currentFilter.label}
          />

          {/* Map legend */}
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500 ring-2 ring-white" />
                <span className="text-zinc-600">{currentFilter.label} this week</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-400 ring-2 ring-white" />
                <span className="text-zinc-600">Outside range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-900 ring-2 ring-white" />
                <span className="text-zinc-600">Your location</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
