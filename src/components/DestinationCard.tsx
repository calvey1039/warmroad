"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { WeatherData, WeatherCondition } from "@/lib/weather";
import { getWeatherCategory } from "@/lib/weather";
import { formatDriveTime, calculateFuelCost, formatFuelCost } from "@/lib/distance";

interface TempFilterConfig {
  min: number | null;
  max: number | null;
  label: string;
}

interface DestinationCardProps {
  id: string;
  name: string;
  state: string;
  description: string;
  weather: WeatherData | null;
  driveTime: number;
  distance: number;
  tempFilter: TempFilterConfig;
  weatherCondition: WeatherCondition;
  isSelected: boolean;
  onSelect: () => void;
  mpg: number;
  gasPrice: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  preferredLodgingSite: string;
  preferredFlightSite: string;
  preferredCarRentalSite: string;
  userLat?: number;
  userLon?: number;
}

export default function DestinationCard({
  id,
  name,
  state,
  description,
  weather,
  driveTime,
  distance,
  tempFilter,
  weatherCondition,
  isSelected,
  onSelect,
  mpg,
  gasPrice,
  isFavorite,
  onToggleFavorite,
  preferredLodgingSite,
  preferredFlightSite,
  preferredCarRentalSite,
  userLat,
  userLon,
}: DestinationCardProps) {
  const [showForecast, setShowForecast] = useState(false);

  const fuelCost = calculateFuelCost(distance, gasPrice, mpg);

  const warmestDay = weather?.forecast?.reduce(
    (best, day) => (best ? (day.maxTemp > best.maxTemp ? day : best) : day),
    weather?.forecast?.[0]
  );

  const { checkIn, checkOut } = (() => {
    if (!warmestDay?.date) return { checkIn: "", checkOut: "" };
    const start = new Date(warmestDay.date);
    const end = new Date(warmestDay.date);
    end.setDate(end.getDate() + 2);
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    return { checkIn: fmt(start), checkOut: fmt(end) };
  })();

  const lodgingEstimate = (() => {
    const n = name.toLowerCase();
    if (n.includes("vegas") || n.includes("miami") || n.includes("san francisco"))
      return { label: "$150-350/night" };
    if (n.includes("austin") || n.includes("denver") || n.includes("san diego"))
      return { label: "$120-280/night" };
    if (n.includes("tucson") || n.includes("phoenix") || n.includes("albuquerque"))
      return { label: "$90-200/night" };
    return { label: "$80-180/night" };
  })();

  const encodedDest = encodeURIComponent(`${name}, ${state}`);

  const lodgingSites = [
    {
      id: "expedia",
      name: "Expedia",
      url: `https://www.expedia.com/Hotel-Search?destination=${encodedDest}&startDate=${checkIn || ""}&endDate=${checkOut || ""}&rooms=1&adults=2`,
      icon: "\uD83C\uDFE8",
    },
    {
      id: "vrbo",
      name: "VRBO",
      url: `https://www.vrbo.com/search?destination=${encodedDest}&startDate=${checkIn || ""}&endDate=${checkOut || ""}&adults=2&affcid=ncpxw7r`,
      icon: "\uD83C\uDFE1",
    },
    {
      id: "booking",
      name: "Booking.com",
      url: `https://www.awin1.com/cread.php?awinmid=6776&awinaffid=2785874&ued=${encodeURIComponent(`https://www.booking.com/searchresults.html?ss=${name}, ${state}&checkin=${checkIn || ""}&checkout=${checkOut || ""}`)}`,
      icon: "\uD83C\uDD71\uFE0F",
    },
    {
      id: "hotels",
      name: "Hotels.com",
      url: `https://www.hotels.com/Hotel-Search?destination=${encodedDest}&startDate=${checkIn || ""}&endDate=${checkOut || ""}&rooms=1&adults=2&affcid=FpWwOIV`,
      icon: "\uD83C\uDFE9",
    },
  ];

  const flightSites = [
    {
      id: "expedia_flights",
      name: "Expedia",
      url: `https://expedia.com/affiliate/6CA53pQ?destination=${encodedDest}`,
      icon: "\uD83C\uDFE8",
    },
    {
      id: "booking_flights",
      name: "Booking.com",
      url: `https://www.awin1.com/cread.php?awinmid=6776&awinaffid=2785874&campaign=flights&ued=${encodeURIComponent("https://www.booking.com/flights/index.html")}`,
      icon: "\uD83C\uDD71\uFE0F",
    },
  ];

  const carSites = [
    {
      id: "expedia_cars",
      name: "Expedia",
      url: `https://expedia.com/affiliate/6XiIxgP?destination=${encodedDest}`,
      icon: "\uD83C\uDFE8",
    },
    {
      id: "booking_cars",
      name: "Booking.com",
      url: `https://www.awin1.com/cread.php?awinmid=6776&awinaffid=2785874&campaign=CarRentals&ued=${encodeURIComponent("https://www.booking.com/cars/index.html")}`,
      icon: "\uD83C\uDD71\uFE0F",
    },
  ];

  const sortedLodging = [...lodgingSites].sort((a, b) =>
    a.id === preferredLodgingSite ? -1 : b.id === preferredLodgingSite ? 1 : 0
  );
  const sortedFlights = [...flightSites].sort((a, b) =>
    a.id === preferredFlightSite ? -1 : b.id === preferredFlightSite ? 1 : 0
  );
  const sortedCars = [...carSites].sort((a, b) =>
    a.id === preferredCarRentalSite ? -1 : b.id === preferredCarRentalSite ? 1 : 0
  );

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${name}, ${state}`)}`;
  const tripAdvisorUrl = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(`${name}, ${state}`)}`;

  const dayMeetsFilter = (maxTemp: number, weatherCode: number) => {
    const meetsMin = tempFilter.min === null || maxTemp >= tempFilter.min;
    const meetsMax = tempFilter.max === null || maxTemp <= tempFilter.max;
    const meetsWeather = weatherCondition === "any" || getWeatherCategory(weatherCode) === weatherCondition;
    return meetsMin && meetsMax && meetsWeather;
  };

  const matchingDaysCount = weather?.forecast?.filter(d => dayMeetsFilter(d.maxTemp, d.weatherCode)).length || 0;

  return (
    <Card
      className={`group relative cursor-pointer overflow-hidden transition-all duration-300 border-0 bg-zinc-50 dark:bg-zinc-900 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-lg ${
        isSelected
          ? "ring-2 ring-zinc-900 dark:ring-zinc-100 shadow-lg bg-white dark:bg-zinc-800"
          : "hover:ring-1 hover:ring-zinc-300 dark:hover:ring-zinc-600"
      }`}
      onClick={onSelect}
    >
      <div className="p-5">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-all duration-200 z-10 ${
            isFavorite
              ? "bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-300"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight truncate pr-8">{name}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{state}</p>
          </div>
          {weather && warmestDay && (
            <div className="flex flex-col items-end shrink-0 mr-6">
              <span className="text-2xl font-light text-zinc-900 dark:text-zinc-100">{warmestDay.maxTemp}&deg;</span>
              <span className="text-xs text-zinc-400 mt-0.5">
                Warmest: {warmestDay.dayName}
                {warmestDay.date ? `, ${new Date(warmestDay.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
              </span>
              <Link
                href={`/route-weather/${id}?fromLat=${userLat ?? ""}&fromLon=${userLon ?? ""}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-orange-600 transition-colors mt-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                Route Weather
              </Link>
            </div>
          )}
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">{description}</p>

        {matchingDaysCount > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 text-xs">
              {matchingDaysCount} day{matchingDaysCount !== 1 ? "s" : ""} {tempFilter.label}
            </Badge>
          </div>
        )}

        {weather && weather.forecast && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowForecast(!showForecast); }}
            className="w-full mb-4 text-left"
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              <span className="font-medium">10-Day Forecast</span>
              <svg className={`w-4 h-4 transition-transform ${showForecast ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        )}

        {showForecast && weather && weather.forecast && (
          <div className="mb-4 p-3 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg">
            <div className="grid grid-cols-5 gap-1">
              {weather.forecast.map((day) => {
                const meetsFilter = dayMeetsFilter(day.maxTemp, day.weatherCode);
                const isWarmest = warmestDay && day.date === warmestDay.date;
                return (
                  <div key={day.date} className={`flex flex-col items-center text-center p-1 rounded ${meetsFilter ? "bg-orange-100" : ""} ${isWarmest ? "ring-2 ring-orange-400" : ""}`}>
                    <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">{day.dayName}</span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 mb-1">
                      {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
                    </span>
                    <span className="text-sm">{day.icon}</span>
                    <span className={`text-xs font-semibold mt-1 ${meetsFilter ? "text-orange-600" : "text-zinc-900 dark:text-zinc-100"}`}>{day.maxTemp}&deg;</span>
                    <span className="text-[10px] text-zinc-400">{day.minTemp}&deg;</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 hover:bg-zinc-100 font-normal text-xs px-2.5 py-1">
              {formatDriveTime(driveTime)} drive
            </Badge>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 font-normal text-xs px-2.5 py-1">
              {formatFuelCost(fuelCost)} fuel (round trip)
            </Badge>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 font-normal text-xs px-2.5 py-1">
              {lodgingEstimate.label}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-1.5 md:gap-2">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors">
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Directions
            </a>

            <a href={tripAdvisorUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors">
              Activities
              <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors outline-none">
                Lodging
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg rounded-lg p-1 max-h-64 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {sortedLodging.map((site) => (
                  <DropdownMenuItem key={site.id} asChild>
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-3 py-2 text-sm hover:text-orange-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-md cursor-pointer transition-colors ${site.id === preferredLodgingSite ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20" : "text-zinc-700 dark:text-zinc-300"}`}>
                      <span className="text-base">{site.icon}</span>
                      {site.name}
                      {site.id === preferredLodgingSite && <span className="text-orange-500 text-xs">★</span>}
                      <svg className="w-3 h-3 ml-auto text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors outline-none">
                Flights
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg rounded-lg p-1 max-h-64 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {sortedFlights.map((site) => (
                  <DropdownMenuItem key={site.id} asChild>
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-3 py-2 text-sm hover:text-orange-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-md cursor-pointer transition-colors ${site.id === preferredFlightSite ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20" : "text-zinc-700 dark:text-zinc-300"}`}>
                      <span className="text-base">{site.icon}</span>
                      {site.name}
                      {site.id === preferredFlightSite && <span className="text-orange-500 text-xs">★</span>}
                      <svg className="w-3 h-3 ml-auto text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors outline-none">
                Cars
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg rounded-lg p-1 max-h-64 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {sortedCars.map((site) => (
                  <DropdownMenuItem key={site.id} asChild>
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-3 py-2 text-sm hover:text-orange-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-md cursor-pointer transition-colors ${site.id === preferredCarRentalSite ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20" : "text-zinc-700 dark:text-zinc-300"}`}>
                      <span className="text-base">{site.icon}</span>
                      {site.name}
                      {site.id === preferredCarRentalSite && <span className="text-orange-500 text-xs">★</span>}
                      <svg className="w-3 h-3 ml-auto text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {matchingDaysCount > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500" />
      )}
    </Card>
  );
}
