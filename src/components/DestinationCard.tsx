"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { WeatherData } from "@/lib/weather";
import { formatDriveTime } from "@/lib/distance";

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
  tempFilter: TempFilterConfig;
  isSelected: boolean;
  onSelect: () => void;
}

export default function DestinationCard({
  name,
  state,
  description,
  weather,
  driveTime,
  tempFilter,
  isSelected,
  onSelect,
}: DestinationCardProps) {
  const [showForecast, setShowForecast] = useState(false);

  const expediaUrl = `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(
    `${name}, ${state}`
  )}`;

  const handleToggleForecast = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowForecast(!showForecast);
  };

  // Check if a day meets the filter criteria
  const dayMeetsFilter = (maxTemp: number) => {
    const meetsMin = tempFilter.min === null || maxTemp >= tempFilter.min;
    const meetsMax = tempFilter.max === null || maxTemp <= tempFilter.max;
    return meetsMin && meetsMax;
  };

  // Find days that match the filter and count them
  const matchingDaysCount = weather?.forecast?.filter(d => dayMeetsFilter(d.maxTemp)).length || 0;

  // Find the best day based on filter type
  const bestDay = weather?.forecast?.reduce((best, day) => {
    if (!dayMeetsFilter(day.maxTemp)) return best;
    if (!best || !dayMeetsFilter(best.maxTemp)) return day;
    // For "under X" filters, prefer cooler temps; for "X+" filters, prefer warmer
    if (tempFilter.max !== null) {
      return day.maxTemp < best.maxTemp ? day : best;
    }
    return day.maxTemp > best.maxTemp ? day : best;
  }, weather?.forecast?.find(d => dayMeetsFilter(d.maxTemp)));

  return (
    <Card
      className={`group relative cursor-pointer overflow-hidden transition-all duration-300 border-0 bg-zinc-50 hover:bg-white hover:shadow-lg ${
        isSelected
          ? "ring-2 ring-zinc-900 shadow-lg bg-white"
          : "hover:ring-1 hover:ring-zinc-300"
      }`}
      onClick={onSelect}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-zinc-900 tracking-tight truncate">
              {name}
            </h3>
            <p className="text-sm text-zinc-500 font-medium">{state}</p>
          </div>

          {weather && bestDay && (
            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-light text-zinc-900">
                  {bestDay.maxTemp}°
                </span>
              </div>
              <span className="text-xs text-zinc-400 mt-0.5">
                {bestDay.dayName === "Today" ? "Today" : `Best: ${bestDay.dayName}`}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-600 leading-relaxed mb-3">
          {description}
        </p>

        {/* Matching days indicator */}
        {matchingDaysCount > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 text-xs">
              {matchingDaysCount} day{matchingDaysCount !== 1 ? "s" : ""} {tempFilter.label}
            </Badge>
          </div>
        )}

        {/* 7-Day Forecast Toggle */}
        {weather && weather.forecast && (
          <button
            onClick={handleToggleForecast}
            className="w-full mb-4 text-left"
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 hover:text-zinc-700 transition-colors">
              <span className="font-medium">7-Day Forecast</span>
              <svg
                className={`w-4 h-4 transition-transform ${showForecast ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        )}

        {/* 7-Day Forecast Display */}
        {showForecast && weather && weather.forecast && (
          <div className="mb-4 p-3 bg-zinc-100/80 rounded-lg">
            <div className="grid grid-cols-7 gap-1">
              {weather.forecast.map((day) => {
                const meetsFilter = dayMeetsFilter(day.maxTemp);
                return (
                  <div
                    key={day.date}
                    className={`flex flex-col items-center text-center p-1 rounded ${
                      meetsFilter ? "bg-orange-100" : ""
                    }`}
                  >
                    <span className="text-[10px] font-medium text-zinc-500 mb-1">
                      {day.dayName}
                    </span>
                    <span className="text-sm">{day.icon}</span>
                    <span className={`text-xs font-semibold mt-1 ${
                      meetsFilter ? "text-orange-600" : "text-zinc-900"
                    }`}>
                      {day.maxTemp}°
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {day.minTemp}°
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="secondary"
            className="bg-zinc-100 text-zinc-600 hover:bg-zinc-100 font-normal text-xs px-2.5 py-1"
          >
            {formatDriveTime(driveTime)} drive
          </Badge>

          <a
            href={expediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 hover:text-orange-600 transition-colors"
          >
            Find lodging
            <svg
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Matching indicator bar */}
      {matchingDaysCount > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500" />
      )}
    </Card>
  );
}
