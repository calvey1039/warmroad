"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { getHourlyWeatherForLocation, type HourlyForecast } from "@/lib/weather";
import { calculateDistance, formatDriveTime, estimateDriveTime, getRouteWaypoints, type RouteWaypoint } from "@/lib/distance";
import { geocodeLocation, reverseGeocode } from "@/lib/geocoding";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function BookingLinks({ destination }: { destination: string }) {
  const encodedDest = encodeURIComponent(destination);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkOut = new Date(tomorrow);
  checkOut.setDate(checkOut.getDate() + 2);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const checkInStr = fmt(tomorrow);
  const checkOutStr = fmt(checkOut);

  const lodgingSites = [
    { id: "expedia", name: "Expedia", url: `https://www.expedia.com/Hotel-Search?destination=${encodedDest}&startDate=${checkInStr}&endDate=${checkOutStr}&rooms=1&adults=2`, icon: "\uD83C\uDFE8" },
    { id: "vrbo", name: "VRBO", url: `https://www.vrbo.com/search?destination=${encodedDest}&startDate=${checkInStr}&endDate=${checkOutStr}&adults=2&affcid=ncpxw7r`, icon: "\uD83C\uDFE1" },
    { id: "booking", name: "Booking.com", url: `https://www.awin1.com/cread.php?awinmid=6776&awinaffid=2785874&ued=${encodeURIComponent(`https://www.booking.com/searchresults.html?ss=${destination}&checkin=${checkInStr}&checkout=${checkOutStr}`)}`, icon: "\uD83C\uDD71\uFE0F" },
    { id: "hotels", name: "Hotels.com", url: `https://www.hotels.com/Hotel-Search?destination=${encodedDest}&startDate=${checkInStr}&endDate=${checkOutStr}&rooms=1&adults=2&affcid=FpWwOIV`, icon: "\uD83C\uDFE9" },
  ];

  const flightSites = [
    { id: "expedia_flights", name: "Expedia", url: `https://expedia.com/affiliate/6CA53pQ?destination=${encodedDest}`, icon: "\uD83C\uDFE8" },
    { id: "booking_flights", name: "Booking.com", url: `https://www.awin1.com/cread.php?awinmid=6776&awinaffid=2785874&campaign=flights&ued=${encodeURIComponent("https://www.booking.com/flights/index.html")}`, icon: "\uD83C\uDD71\uFE0F" },
  ];

  const carSites = [
    { id: "expedia_cars", name: "Expedia", url: `https://expedia.com/affiliate/6XiIxgP?destination=${encodedDest}`, icon: "\uD83C\uDFE8" },
    { id: "booking_cars", name: "Booking.com", url: `https://www.awin1.com/cread.php?awinmid=6776&awinaffid=2785874&campaign=CarRentals&ued=${encodeURIComponent("https://www.booking.com/cars/index.html")}`, icon: "\uD83C\uDD71\uFE0F" },
  ];

  const chevron = (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const externalIcon = (
    <svg className="w-3 h-3 ml-auto text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );

  return (
    <div className="flex items-center gap-4 mt-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors outline-none">
          Lodging{chevron}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg rounded-lg p-1 max-h-64 overflow-y-auto">
          {lodgingSites.map(site => (
            <DropdownMenuItem key={site.id} asChild>
              <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-orange-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-md cursor-pointer transition-colors">
                <span className="text-base">{site.icon}</span>
                {site.name}
                {externalIcon}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors outline-none">
          Flights{chevron}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg rounded-lg p-1 max-h-64 overflow-y-auto">
          {flightSites.map(site => (
            <DropdownMenuItem key={site.id} asChild>
              <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-orange-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-md cursor-pointer transition-colors">
                <span className="text-base">{site.icon}</span>
                {site.name}
                {externalIcon}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors outline-none">
          Cars{chevron}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg rounded-lg p-1 max-h-64 overflow-y-auto">
          {carSites.map(site => (
            <DropdownMenuItem key={site.id} asChild>
              <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-orange-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-md cursor-pointer transition-colors">
                <span className="text-base">{site.icon}</span>
                {site.name}
                {externalIcon}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Weather data matched to a route waypoint at a specific time
interface RouteWeatherPoint {
  waypoint: RouteWaypoint;
  arrivalTime: string;
  forecast: HourlyForecast | null;
}

async function fetchRouteWeatherData(
  waypoints: RouteWaypoint[],
  selectedDate: string,
  departureHour: number,
): Promise<RouteWeatherPoint[]> {
  const results: RouteWeatherPoint[] = [];

  for (const wp of waypoints) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${wp.lat}&longitude=${wp.lon}&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&start_date=${selectedDate}&end_date=${selectedDate}`;
      const response = await fetch(url);
      if (!response.ok) {
        results.push({ waypoint: wp, arrivalTime: "", forecast: null });
        continue;
      }
      const data = await response.json();

      const arrivalHourFloat = departureHour + wp.estimatedHour;
      const arrivalHour = Math.round(arrivalHourFloat);

      const d = new Date(selectedDate);
      d.setHours(arrivalHour);
      const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

      let forecast: HourlyForecast | null = null;
      if (data.hourly && data.hourly.time) {
        const targetIdx = data.hourly.time.findIndex((t: string) => {
          const h = new Date(t).getHours();
          return h === (arrivalHour % 24);
        });
        if (targetIdx >= 0) {
          const getIcon = (code: number): string => {
            if (code === 0) return "\u2600\uFE0F";
            if (code >= 1 && code <= 2) return "\uD83C\uDF24\uFE0F";
            if (code === 3) return "\u2601\uFE0F";
            if (code >= 45 && code <= 48) return "\uD83C\uDF2B\uFE0F";
            if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67)) return "\uD83C\uDF27\uFE0F";
            if (code >= 71 && code <= 77) return "\u2744\uFE0F";
            if (code >= 80 && code <= 82) return "\uD83C\uDF26\uFE0F";
            if (code >= 85 && code <= 86) return "\uD83C\uDF28\uFE0F";
            if (code >= 95) return "\u26C8\uFE0F";
            return "\uD83C\uDF21\uFE0F";
          };
          forecast = {
            time: data.hourly.time[targetIdx],
            temperature: Math.round(data.hourly.temperature_2m[targetIdx]),
            weatherCode: data.hourly.weather_code[targetIdx],
            icon: getIcon(data.hourly.weather_code[targetIdx]),
            condition: "",
            windSpeed: Math.round(data.hourly.wind_speed_10m[targetIdx]),
            humidity: 0,
            precipitationProbability: Math.round(data.hourly.precipitation_probability?.[targetIdx] ?? 0),
          };
        }
      }

      results.push({ waypoint: wp, arrivalTime: timeStr, forecast });
    } catch (err) {
      console.error("Hourly weather fetch error:", err);
      results.push({ waypoint: wp, arrivalTime: "", forecast: null });
    }
  }

  return results;
}

export default function RouteWeatherCustomPage() {
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromCoords, setFromCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [toCoords, setToCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [isGeocodingFrom, setIsGeocodingFrom] = useState(false);
  const [isGeocodingTo, setIsGeocodingTo] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [departureHour, setDepartureHour] = useState(8);
  const [routeWeather, setRouteWeather] = useState<RouteWeatherPoint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [cityNames, setCityNames] = useState<Record<number, string>>({});

  const hasRoute = fromCoords && toCoords;

  const dist = hasRoute ? calculateDistance(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon) : 0;
  const driveHours = estimateDriveTime(dist);

  const travelDates = useMemo(() => {
    const dates: { value: string; label: string }[] = [];
    for (let i = 0; i < 10; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const label = i === 0 ? `Today - ${dayLabel}` : i === 1 ? `Tomorrow - ${dayLabel}` : dayLabel;
      dates.push({ value: dateStr, label });
    }
    return dates;
  }, []);

  useEffect(() => {
    if (travelDates.length > 0 && !selectedDate) {
      setSelectedDate(travelDates[0].value);
    }
  }, [travelDates, selectedDate]);

  const waypoints = useMemo(() => {
    if (!hasRoute) return [];
    const intermediateCount = Math.max(2, Math.min(6, Math.round(driveHours / 1.5)));
    return getRouteWaypoints(
      fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon,
      fromName,
      toName,
      dist,
      intermediateCount
    );
  }, [hasRoute, fromCoords, toCoords, fromName, toName, dist, driveHours]);

  useEffect(() => {
    if (waypoints.length <= 2) return;
    setCityNames({});
    waypoints.slice(1, -1).forEach((wp, idx) => {
      const waypointIndex = idx + 1;
      reverseGeocode(wp.lat, wp.lon).then(name => {
        setCityNames(prev => ({ ...prev, [waypointIndex]: name }));
      });
    });
  }, [waypoints]);

  useEffect(() => {
    if (!selectedDate || waypoints.length === 0) return;
    setLoading(true);
    fetchRouteWeatherData(waypoints, selectedDate, departureHour).then(data => {
      setRouteWeather(data);
      setLoading(false);
    });
  }, [selectedDate, departureHour, waypoints]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromQuery.trim() || !toQuery.trim()) return;

    setGeocodeError(null);
    setRouteWeather(null);
    setCityNames({});
    setIsGeocodingFrom(true);
    setIsGeocodingTo(true);

    const [fromResult, toResult] = await Promise.all([
      geocodeLocation(fromQuery.trim()),
      geocodeLocation(toQuery.trim()),
    ]);

    setIsGeocodingFrom(false);
    setIsGeocodingTo(false);

    if (!fromResult && !toResult) {
      setGeocodeError("Could not find either location. Please check your entries and try again.");
      return;
    }
    if (!fromResult) {
      setGeocodeError("Could not find the starting location. Please check and try again.");
      return;
    }
    if (!toResult) {
      setGeocodeError("Could not find the destination. Please check and try again.");
      return;
    }

    setFromCoords({ lat: fromResult.lat, lon: fromResult.lon });
    setToCoords({ lat: toResult.lat, lon: toResult.lon });
    setFromName(`${fromResult.name}${fromResult.state ? `, ${fromResult.state}` : ""}`);
    setToName(`${toResult.name}${toResult.state ? `, ${toResult.state}` : ""}`);
  };

  const isGeocoding = isGeocodingFrom || isGeocodingTo;

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
          <h1 className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Route Weather</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Check the weather along any route
          </p>
        </div>
      </header>

      <div className="px-4 md:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Location inputs */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="flex-1">
                <label htmlFor="from-location" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Starting Location</label>
                <input
                  id="from-location"
                  type="text"
                  value={fromQuery}
                  onChange={e => setFromQuery(e.target.value)}
                  placeholder="City, State or Zip"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="to-location" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Destination</label>
                <input
                  id="to-location"
                  type="text"
                  value={toQuery}
                  onChange={e => setToQuery(e.target.value)}
                  placeholder="City, State or Zip"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!fromQuery.trim() || !toQuery.trim() || isGeocoding}
              className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGeocoding ? "Looking up locations..." : "Check Route Weather"}
            </button>
          </form>

          {geocodeError && (
            <div className="mb-4 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-400">
              {geocodeError}
            </div>
          )}

          {/* Route summary */}
          {hasRoute && (
            <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {fromName} &rarr; {toName}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                {Math.round(dist)} miles &middot; {formatDriveTime(driveHours)} drive
              </p>
              <BookingLinks destination={toName} />
            </div>
          )}

          {/* Departure controls - only show after route is set */}
          {hasRoute && (
            <div className="mb-6 flex flex-wrap gap-4">
              <div>
                <label htmlFor="departure-date" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Departure Date</label>
                <select
                  id="departure-date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  {travelDates.map(date => (
                    <option key={date.value} value={date.value}>{date.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="departure-time" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Departure Time</label>
                <select
                  id="departure-time"
                  value={departureHour}
                  onChange={(e) => setDepartureHour(Number(e.target.value))}
                  className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  {Array.from({ length: 18 }, (_, i) => i + 4).map(hour => {
                    const ampm = hour >= 12 ? "PM" : "AM";
                    const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                    return (
                      <option key={hour} value={hour}>{h12}:00 {ampm}</option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-zinc-300 border-t-orange-500 rounded-full animate-spin" />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading route weather...</span>
              </div>
            </div>
          )}

          {/* Prompt when no route yet */}
          {!hasRoute && !geocodeError && (
            <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-8">
              Enter a starting location and destination above to see the weather along your route.
            </p>
          )}

          {/* Route weather results */}
          {!loading && routeWeather && routeWeather.length > 0 && (
            <div className="space-y-0">
              {routeWeather.map((point, idx) => {
                const isStart = idx === 0;
                const isEnd = idx === routeWeather.length - 1;
                const displayName = isStart
                  ? fromName
                  : isEnd
                  ? toName
                  : cityNames[idx] || point.waypoint.label;

                return (
                  <div key={idx} className="flex gap-4 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                        isStart ? "bg-green-500 border-green-500" :
                        isEnd ? "bg-orange-500 border-orange-500" :
                        "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600"
                      }`} />
                      {!isEnd && (
                        <div className="w-0.5 flex-1 bg-zinc-200 dark:bg-zinc-700 min-h-[40px]" />
                      )}
                    </div>

                    <div className={`flex-1 pb-4 ${isEnd ? "" : "mb-1"}`}>
                      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              isStart ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                              isEnd ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" :
                              "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            }`}>
                              {displayName}
                            </span>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                              {point.arrivalTime}
                            </p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                              {point.waypoint.distanceFromStart} miles
                              {idx < routeWeather.length - 1 && (
                                <> &middot; {Math.round(routeWeather[idx + 1].waypoint.distanceFromStart - point.waypoint.distanceFromStart)} miles to next</>
                              )}
                            </p>
                          </div>
                          {point.forecast ? (
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{point.forecast.icon}</span>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                  {point.forecast.temperature}&deg;F
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-400">No data</span>
                          )}
                        </div>
                        {point.forecast && (
                          <div className="flex gap-4 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                            <span>{point.forecast.windSpeed} mph wind</span>
                            <span>{point.forecast.precipitationProbability}% precip</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Disclaimer */}
          {!loading && routeWeather && routeWeather.length > 0 && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-6 text-center">
              Weather data from Open-Meteo. Route is approximated as a straight line; actual driving route may vary.
              Temperatures shown are for the estimated arrival time at each point along the route based on an average speed of 55 mph.
            </p>
          )}

          {/* Get Directions link */}
          {!loading && routeWeather && routeWeather.length > 0 && hasRoute && (
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <a
                href={`https://www.google.com/maps/dir/${fromCoords.lat},${fromCoords.lon}/${toCoords.lat},${toCoords.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium"
              >
                Get Directions
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
