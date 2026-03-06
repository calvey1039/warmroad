"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { destinations, type Destination } from "@/lib/destinations";
import {
  getWeatherForLocation,
  meetsTemperatureCriteria,
  getMatchingDaysCount,
  weatherConditionLabels,
  type WeatherData,
  type WeatherCondition,
} from "@/lib/weather";
import {
  calculateDistance,
  estimateDriveTime,
  formatDriveTime,
  calculateFuelCost,
  formatFuelCost,
  DEFAULT_MPG,
  DEFAULT_GAS_PRICE,
} from "@/lib/distance";
import { geocodeLocation, fetchGasPrice } from "@/lib/geocoding";
import DestinationCard from "@/components/DestinationCard";
import Logo from "@/components/Logo";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";

const MapView = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-zinc-100 animate-pulse" />
  ),
});

const FAVORITES_KEY = "warmroad_favorites";
const PREFERENCES_KEY = "warmroad_preferences";
const DARK_MODE_KEY = "warmroad_dark_mode";

const lodgingOptions = [
  { id: "expedia", name: "Expedia" },
  { id: "vrbo", name: "VRBO" },
  { id: "booking", name: "Booking.com" },
  { id: "hotels", name: "Hotels.com" },
];

const flightOptions = [
  { id: "expedia_flights", name: "Expedia" },
  { id: "booking_flights", name: "Booking.com" },
];

const carOptions = [
  { id: "expedia_cars", name: "Expedia" },
  { id: "booking_cars", name: "Booking.com" },
];

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [maxDriveHours, setMaxDriveHours] = useState<number>(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [tempRange, setTempRange] = useState<number[]>([60, 90]);
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>("any");
  const [showSettings, setShowSettings] = useState(false);
  const [mpg, setMpg] = useState(DEFAULT_MPG);
  const [gasPrice, setGasPrice] = useState(DEFAULT_GAS_PRICE);
  const [gasPriceSource, setGasPriceSource] = useState("default");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("drive_time");
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [preferredLodgingSite, setPreferredLodgingSite] = useState("expedia");
  const [preferredFlightSite, setPreferredFlightSite] = useState("expedia_flights");
  const [preferredCarRentalSite, setPreferredCarRentalSite] = useState("expedia_cars");

  // Set of valid destination IDs for validating favorites
  const validDestinationIds = useMemo(() => new Set(destinations.map(d => d.id)), []);
  // Track whether favorites have been loaded from storage to prevent the persist effect from clearing them on mount
  const favoritesLoadedRef = useRef(false);

  // Load persisted state
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem(FAVORITES_KEY);
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) {
          // Only keep IDs that correspond to actual destinations
          const validFavs = parsed.filter((id: string) => validDestinationIds.has(id));
          setFavorites(new Set(validFavs));
        }
      }
      const savedPrefs = localStorage.getItem(PREFERENCES_KEY);
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        if (prefs.preferredLodgingSite) setPreferredLodgingSite(prefs.preferredLodgingSite);
        if (prefs.preferredFlightSite) setPreferredFlightSite(prefs.preferredFlightSite);
        if (prefs.preferredCarRentalSite) setPreferredCarRentalSite(prefs.preferredCarRentalSite);
      }
      const savedDark = localStorage.getItem(DARK_MODE_KEY);
      if (savedDark === "true") setIsDarkMode(true);
    } catch (e) {
      console.error("Failed to load from localStorage:", e);
    }
    favoritesLoadedRef.current = true;
  }, [validDestinationIds]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    try { localStorage.setItem(DARK_MODE_KEY, String(isDarkMode)); } catch {}
  }, [isDarkMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const favParam = params.get("favorites");
    if (favParam) {
      // Only keep IDs that correspond to actual destinations
      const favIds = favParam.split(",").filter(id => id && validDestinationIds.has(id));
      if (favIds.length > 0) {
        setFavorites(new Set(favIds));
        favoritesLoadedRef.current = true;
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [validDestinationIds]);

  useEffect(() => {
    if (!favoritesLoadedRef.current) return;
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites])); } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify({
        preferredLodgingSite, preferredFlightSite, preferredCarRentalSite,
      }));
    } catch {}
  }, [preferredLodgingSite, preferredFlightSite, preferredCarRentalSite]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const shareFavorites = useCallback(() => {
    if (favorites.size === 0) { alert("No favorites to share!"); return; }
    const url = `${window.location.origin}${window.location.pathname}?favorites=${encodeURIComponent([...favorites].join(","))}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => alert("Share link copied to clipboard!")).catch(() => prompt("Copy this link:", url));
    } else { prompt("Copy this link:", url); }
  }, [favorites]);

  useEffect(() => { fetchGasPrice().then(r => { setGasPrice(r.price); setGasPriceSource(r.source); }); }, []);

  useEffect(() => {
    if (!navigator.geolocation) { setLocationError("Geolocation is not supported"); setIsLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }); setLocationName("Your location"); setIsLoading(false); },
      () => { setUserLocation({ lat: 39.8283, lon: -98.5795 }); setLocationName("Central US"); setLocationError("Location access denied. Enter a zip code or showing from central US."); setIsLoading(false); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsGeocoding(true); setLocationError(null);
    const result = await geocodeLocation(searchQuery.trim());
    if (result) { setUserLocation({ lat: result.lat, lon: result.lon }); setLocationName(`${result.name}${result.state ? `, ${result.state}` : ""}`); setWeatherData({}); setLoadingWeather(true); }
    else { setLocationError("Could not find that location. Please try again."); }
    setIsGeocoding(false);
  };

  const weatherFetchRef = useRef(0);

  const destinationsWithDistance = useMemo(() => {
    if (!userLocation) return [];
    return destinations.map(dest => {
      const distance = calculateDistance(userLocation.lat, userLocation.lon, dest.lat, dest.lon);
      return { ...dest, distance, driveTime: estimateDriveTime(distance) };
    }).filter(d => d.driveTime <= maxDriveHours).sort((a, b) => a.driveTime - b.driveTime);
  }, [userLocation, maxDriveHours]);

  const destinationsWithWeather = useMemo(() =>
    destinationsWithDistance.map(d => ({ ...d, weather: weatherData[d.id] || null })),
  [destinationsWithDistance, weatherData]);

  const currentFilter = useMemo(() => ({
    min: tempRange[0], max: tempRange[1], label: `${tempRange[0]}\u00B0F - ${tempRange[1]}\u00B0F`,
  }), [tempRange]);

  const filteredDestinations = useMemo(() => {
    let filtered = destinationsWithWeather.filter(d =>
      meetsTemperatureCriteria(d.weather, currentFilter.min, currentFilter.max, weatherCondition)
    );
    if (showFavoritesOnly) filtered = filtered.filter(d => favorites.has(d.id));

    filtered.sort((a, b) => {
      const aFav = favorites.has(a.id), bFav = favorites.has(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      switch (sortBy) {
        case "best_match": {
          const ac = getMatchingDaysCount(a.weather, currentFilter.min, currentFilter.max, weatherCondition);
          const bc = getMatchingDaysCount(b.weather, currentFilter.min, currentFilter.max, weatherCondition);
          return bc !== ac ? bc - ac : a.driveTime - b.driveTime;
        }
        case "temp_high": return (b.weather?.maxTemp ?? -Infinity) - (a.weather?.maxTemp ?? -Infinity);
        case "temp_low": return (a.weather?.maxTemp ?? Infinity) - (b.weather?.maxTemp ?? Infinity);
        case "distance": return a.distance - b.distance;
        case "name": return a.name.localeCompare(b.name);
        default: return a.driveTime - b.driveTime;
      }
    });
    return filtered;
  }, [destinationsWithWeather, currentFilter, weatherCondition, showFavoritesOnly, favorites, sortBy]);

  useEffect(() => {
    if (destinationsWithDistance.length === 0) return;
    const fetchId = ++weatherFetchRef.current;
    (async () => {
      setLoadingWeather(true);
      const data: Record<string, WeatherData | null> = {};
      for (let i = 0; i < destinationsWithDistance.length; i += 5) {
        if (weatherFetchRef.current !== fetchId) return;
        const batch = destinationsWithDistance.slice(i, i + 5);
        const results = await Promise.all(batch.map(d => getWeatherForLocation(d.lat, d.lon)));
        batch.forEach((d, idx) => { data[d.id] = results[idx]; });
        if (i + 5 < destinationsWithDistance.length) await new Promise(r => setTimeout(r, 200));
      }
      if (weatherFetchRef.current === fetchId) { setWeatherData(data); setLoadingWeather(false); }
    })();
  }, [destinationsWithDistance]);

  const handleSelectDestination = useCallback((id: string) => {
    setSelectedDestination(prev => (prev === id ? null : id));
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-zinc-950 overflow-hidden">
      <header className="shrink-0 px-4 md:px-6 py-3 md:py-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <Logo className="w-10 h-10 md:w-12 md:h-12" />
              <div>
                <h1 className="text-lg md:text-xl font-semibold tracking-wide text-zinc-900 dark:text-zinc-100" style={{ fontFamily: "var(--font-jost), Futura, sans-serif" }}>WARM ROAD</h1>
                <p className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400">Find your ideal weather within driving distance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="City, State or Zip" className="w-40 px-2 py-1.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                <button type="submit" disabled={!searchQuery.trim() || isGeocoding} className="px-3 py-1.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{isGeocoding ? "..." : "Go"}</button>
              </form>
              <button onClick={() => setIsDarkMode(p => !p)} className="px-2 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" aria-label="Toggle dark mode">
                {isDarkMode ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
              </button>
              <button onClick={() => setShowSettings(p => !p)} className="px-2 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" aria-label="Settings">
                <span className="hidden md:inline">{"\u2699\uFE0F"} Settings</span><span className="md:hidden">{"\u2699\uFE0F"}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <form onSubmit={handleSearchSubmit} className="flex md:hidden items-center gap-1">
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="City, ST or Zip" className="w-28 px-2 py-1.5 text-xs border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              <button type="submit" disabled={!searchQuery.trim() || isGeocoding} className="px-2 py-1.5 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{isGeocoding ? "..." : "Go"}</button>
            </form>

            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full px-3 py-1.5">
              <span className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 mr-2">Temp:</span>
              <Slider min={0} max={100} step={1} value={tempRange} onValueChange={v => setTempRange(v)} className="w-32 md:w-32" />
              <span className="ml-2 text-[10px] md:text-xs font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{currentFilter.label}</span>
            </div>

            <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full px-3 py-0.5">
              <span className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 mr-1">Drive Time:</span>
              {[5, 8, 10, 12, 15, 20].map(h => (
                <button key={h} onClick={() => setMaxDriveHours(h)} className={`px-2 py-1 text-[10px] md:text-xs font-medium rounded-full transition-all ${maxDriveHours === h ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`}>{h}hr</button>
              ))}
            </div>

            <button onClick={() => setShowFavoritesOnly(p => !p)} className={`flex items-center gap-1 px-2.5 py-1 text-[10px] md:text-xs font-medium rounded-full transition-all ${showFavoritesOnly ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`}>
              <svg className="w-3 h-3" fill={showFavoritesOnly ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              <span className="hidden sm:inline">Favorites{favorites.size > 0 ? ` (${favorites.size})` : ""}</span>
              <span className="sm:hidden">{favorites.size > 0 ? String(favorites.size) : ""}</span>
            </button>

            {favorites.size > 0 && (
              <button onClick={shareFavorites} className="flex items-center gap-1 px-2.5 py-1 text-[10px] md:text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-all" title="Share favorites">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                <span className="hidden sm:inline">Share</span>
              </button>
            )}

            {locationName && <div className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full hidden sm:block">From: {locationName}</div>}
            {locationError && <div className="text-[10px] md:text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{locationError}</div>}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400">Weather:</span>
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full p-0.5 flex-wrap">
              {(Object.entries(weatherConditionLabels) as [WeatherCondition, string][]).map(([key, label]) => (
                <button key={key} onClick={() => setWeatherCondition(key)} className={`px-2 py-1 text-[10px] md:text-xs font-medium rounded-full transition-all whitespace-nowrap ${weatherCondition === key ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {showSettings && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-4 md:p-6 w-[300px] md:w-[340px]">
          <h2 className="text-base md:text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Trip Settings</h2>
          <div className="mb-4">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Fuel Efficiency (MPG):</label>
            <input type="number" min={10} max={60} step={1} value={mpg} onChange={e => setMpg(Number(e.target.value))} className="w-24 px-2 py-1 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Gas Price ($/gal):</label>
            <input type="number" min={1} max={10} step={0.01} value={gasPrice} onChange={e => setGasPrice(Number(e.target.value))} className="w-24 px-2 py-1 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" />
            <div className="text-xs text-zinc-400 mt-1">{gasPriceSource === "default" ? "Default value" : `Source: ${gasPriceSource}`}</div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Preferred Lodging Site:</label>
            <select value={preferredLodgingSite} onChange={e => setPreferredLodgingSite(e.target.value)} className="w-full px-2 py-1 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              {lodgingOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Preferred Flight Site:</label>
            <select value={preferredFlightSite} onChange={e => setPreferredFlightSite(e.target.value)} className="w-full px-2 py-1 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              {flightOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Preferred Car Rental:</label>
            <select value={preferredCarRentalSite} onChange={e => setPreferredCarRentalSite(e.target.value)} className="w-full px-2 py-1 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              {carOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <button onClick={() => setShowSettings(false)} className="mt-2 px-3 py-1.5 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">Close</button>
        </div>
      )}

      <div className="md:hidden flex border-b border-zinc-100 dark:border-zinc-800">
        <button onClick={() => setMobileView("list")} className={`flex-1 py-2 text-sm font-medium transition-colors ${mobileView === "list" ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"}`}>List ({filteredDestinations.length})</button>
        <button onClick={() => setMobileView("map")} className={`flex-1 py-2 text-sm font-medium transition-colors ${mobileView === "map" ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"}`}>Map</button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <aside className={`${mobileView === "list" ? "flex" : "hidden"} md:flex w-full md:w-[380px] lg:w-[420px] flex-1 md:flex-none min-h-0 md:shrink-0 border-r border-zinc-100 dark:border-zinc-800 flex-col bg-white dark:bg-zinc-950 overflow-hidden`}>
          {!isLoading && filteredDestinations.length > 0 && (
            <div className="shrink-0 flex items-center justify-between px-3 md:px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <span className="text-[10px] md:text-xs text-zinc-400 dark:text-zinc-500">{filteredDestinations.length} result{filteredDestinations.length !== 1 ? "s" : ""}</span>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors appearance-auto">
                  <option value="drive_time">Drive Time</option>
                  <option value="best_match">Best Match (Most Days)</option>
                  <option value="temp_high">Temp (Warmest)</option>
                  <option value="temp_low">Temp (Coolest)</option>
                  <option value="distance">Distance</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          )}
          <div className="flex-1 min-h-0 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>
            <div className="p-3 md:p-4 space-y-2 md:space-y-3">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 md:h-32 w-full rounded-lg" />)
              ) : filteredDestinations.length === 0 && !loadingWeather ? (
                <div className="text-center py-8 md:py-12 px-4 md:px-6">
                  <div className="text-3xl md:text-4xl mb-3 md:mb-4">{showFavoritesOnly ? "\u2764\uFE0F" : "\uD83C\uDF21\uFE0F"}</div>
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2 text-sm md:text-base">{showFavoritesOnly ? "No favorites yet" : "No matching destinations found"}</h3>
                  <p className="text-xs md:text-sm text-zinc-500 leading-relaxed">{showFavoritesOnly ? "Click the heart icon on destinations to add them to your favorites." : `No destinations within ${maxDriveHours} hours match your filters. Try adjusting temperature or weather.`}</p>
                </div>
              ) : (
                filteredDestinations.map(dest => (
                  <DestinationCard
                    key={dest.id} id={dest.id} name={dest.name} state={dest.state} description={dest.description}
                    weather={dest.weather} driveTime={dest.driveTime} distance={dest.distance}
                    tempFilter={currentFilter} weatherCondition={weatherCondition}
                    isSelected={selectedDestination === dest.id} onSelect={() => handleSelectDestination(dest.id)}
                    mpg={mpg} gasPrice={gasPrice}
                    isFavorite={favorites.has(dest.id)} onToggleFavorite={() => toggleFavorite(dest.id)}
                    preferredLodgingSite={preferredLodgingSite} preferredFlightSite={preferredFlightSite} preferredCarRentalSite={preferredCarRentalSite}
                    userLat={userLocation?.lat} userLon={userLocation?.lon}
                  />
                ))
              )}

              {loadingWeather && !isLoading && (
                <div className="text-center py-6 md:py-8">
                  <div className="inline-flex items-center gap-2 text-xs md:text-sm text-zinc-500">
                    <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                    Loading weather data...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center gap-3">
            <Link href="/privacy" className="text-[10px] md:text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <span className="text-zinc-300 dark:text-zinc-600 text-[10px]">|</span>
            <Link href="/road-trip-ideas" className="text-[10px] md:text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Road Trip Ideas</Link>
            <Link href="/android" className="ml-auto text-[10px] md:text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Android App</Link>
          </div>
        </aside>

        <main className={`${mobileView === "map" ? "flex" : "hidden"} md:flex flex-1 relative min-h-[200px]`}>
          <MapView
            userLocation={userLocation}
            destinations={destinationsWithWeather.map(d => {
              const warmestDay = d.weather?.forecast?.reduce(
                (best, day) => (best ? (day.maxTemp > best.maxTemp ? day : best) : day),
                d.weather?.forecast?.[0]
              );
              const matchingDays = d.weather ? getMatchingDaysCount(d.weather, currentFilter.min, currentFilter.max, weatherCondition) : 0;
              return {
                id: d.id,
                name: d.name,
                state: d.state,
                lat: d.lat,
                lon: d.lon,
                maxTemp: d.weather?.maxTemp,
                meetsFilter: meetsTemperatureCriteria(d.weather, currentFilter.min, currentFilter.max, weatherCondition),
                warmestDayTemp: warmestDay?.maxTemp,
                warmestDayName: warmestDay?.dayName,
                warmestDayDate: warmestDay?.date ? new Date(warmestDay.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : undefined,
                driveTimeFormatted: formatDriveTime(d.driveTime),
                fuelCostFormatted: formatFuelCost(calculateFuelCost(d.distance, gasPrice, mpg)),
                matchingDays,
                description: d.description,
                filterLabel: currentFilter.label,
              };
            })}
            selectedDestination={selectedDestination}
            onSelectDestination={handleSelectDestination}
            filterLabel={currentFilter.label}
            weatherCondition={weatherCondition}
            isVisible={mobileView === "map"}
          />
          <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 md:px-4 md:py-3 text-[10px] md:text-xs">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-1.5 md:gap-2"><div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-orange-500 ring-2 ring-white" /><span className="text-zinc-600 dark:text-zinc-400">Matches</span></div>
              <div className="flex items-center gap-1.5 md:gap-2"><div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-zinc-400 ring-2 ring-white" /><span className="text-zinc-600 dark:text-zinc-400">Outside</span></div>
              <div className="flex items-center gap-1.5 md:gap-2 hidden sm:flex"><div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-zinc-900 ring-2 ring-white" /><span className="text-zinc-600 dark:text-zinc-400">You</span></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
