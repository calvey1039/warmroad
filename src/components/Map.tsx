"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Destination {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  maxTemp?: number;
  meetsFilter?: boolean;
  warmestDayTemp?: number;
  warmestDayName?: string;
  warmestDayDate?: string;
  driveTimeFormatted?: string;
  fuelCostFormatted?: string;
  matchingDays?: number;
  description?: string;
  filterLabel?: string;
  routeWeatherUrl?: string;
  lodgingUrl?: string;
  flightsUrl?: string;
  carsUrl?: string;
}

interface MapProps {
  userLocation: { lat: number; lon: number } | null;
  destinations: Destination[];
  selectedDestination: string | null;
  onSelectDestination: (id: string) => void;
  filterLabel: string;
  weatherCondition?: string;
  isVisible?: boolean;
}

export default function MapView({
  userLocation,
  destinations,
  selectedDestination,
  onSelectDestination,
  filterLabel,
  isVisible,
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<globalThis.Map<string, L.CircleMarker>>(new globalThis.Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const activePopupRef = useRef<L.Popup | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [39.8283, -98.5795], // Center of US
      zoom: 4,
      zoomControl: true,
      attributionControl: false,
    });

    // Minimal grayscale tiles
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
      }
    ).addTo(map);

    // Add attribution in corner
    L.control
      .attribution({
        position: "bottomright",
        prefix: false,
      })
      .addTo(map);

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
      userMarkerRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation || !isMapReady) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lon]);
    } else {
      const blackDotIcon = L.divIcon({
        className: "",
        html: '<div style="width:20px;height:20px;background:#000000;border:3px solid #ffffff;border-radius:50%;box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lon], {
        icon: blackDotIcon,
        zIndexOffset: 1000,
      })
        .addTo(mapRef.current)
        .bindPopup("You are here");
    }

    mapRef.current.setView([userLocation.lat, userLocation.lon], 6);
  }, [userLocation, isMapReady]);

  // Update destination markers
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const map = mapRef.current;
    const existingMarkers = markersRef.current;

    // Remove markers that are no longer in destinations
    const currentIds = new Set(destinations.map((d) => d.id));
    existingMarkers.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        existingMarkers.delete(id);
      }
    });

    // Helper to build mini card popup HTML
    const buildPopupHtml = (dest: Destination) => {
      const meetsFilter = dest.meetsFilter === true;
      const tempText = dest.warmestDayTemp !== undefined
        ? `${dest.warmestDayTemp}°`
        : dest.maxTemp !== undefined ? `${dest.maxTemp}°` : "";
      const warmestLabel = dest.warmestDayName
        ? `Warmest: ${dest.warmestDayName}${dest.warmestDayDate ? `, ${dest.warmestDayDate}` : ""}`
        : "";
      const matchBadge = dest.matchingDays && dest.matchingDays > 0
        ? `<span style="display:inline-block;background:#fff7ed;color:#c2410c;font-size:10px;font-weight:600;padding:2px 8px;border-radius:9999px;margin-top:6px;">${dest.matchingDays} day${dest.matchingDays !== 1 ? "s" : ""} ${dest.filterLabel || ""}</span>`
        : "";
      const driveInfo = dest.driveTimeFormatted
        ? `<span style="display:inline-block;background:#f4f4f5;color:#52525b;font-size:10px;padding:2px 8px;border-radius:9999px;">${dest.driveTimeFormatted} drive</span>`
        : "";
      const fuelInfo = dest.fuelCostFormatted
        ? `<span style="display:inline-block;background:#ecfdf5;color:#047857;font-size:10px;padding:2px 8px;border-radius:9999px;">${dest.fuelCostFormatted} fuel RT</span>`
        : "";
      const descText = dest.description
        ? `<p style="font-size:11px;color:#71717a;line-height:1.4;margin:6px 0 0;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${dest.description}</p>`
        : "";

      return `<div style="min-width:200px;max-width:260px;font-family:system-ui,-apple-system,sans-serif;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
          <div style="flex:1;min-width:0;">
            <div style="font-weight:600;font-size:14px;color:#18181b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${dest.name}</div>
            <div style="font-size:12px;color:#71717a;font-weight:500;">${dest.state}</div>
          </div>
          ${tempText ? `<div style="text-align:right;flex-shrink:0;">
            <div style="font-size:22px;font-weight:300;color:#18181b;line-height:1;">${tempText}</div>
            ${warmestLabel ? `<div style="font-size:9px;color:#a1a1aa;margin-top:2px;">${warmestLabel}</div>` : ""}
          </div>` : ""}
        </div>
        ${descText}
        ${matchBadge ? `<div style="margin-top:6px;">${matchBadge}</div>` : ""}
        ${driveInfo || fuelInfo ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;">${driveInfo}${fuelInfo}</div>` : ""}
        ${dest.routeWeatherUrl || dest.lodgingUrl || dest.flightsUrl || dest.carsUrl ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;padding-top:8px;border-top:1px solid #f4f4f5;">
          ${dest.routeWeatherUrl ? `<a href="${dest.routeWeatherUrl}" style="font-size:10px;font-weight:500;color:#71717a;text-decoration:none;display:inline-flex;align-items:center;gap:2px;" onmouseover="this.style.color='#ea580c'" onmouseout="this.style.color='#71717a'">&#9729; Weather</a>` : ""}
          ${dest.lodgingUrl ? `<a href="${dest.lodgingUrl}" target="_blank" rel="noopener noreferrer" style="font-size:10px;font-weight:500;color:#71717a;text-decoration:none;display:inline-flex;align-items:center;gap:2px;" onmouseover="this.style.color='#ea580c'" onmouseout="this.style.color='#71717a'">&#127976; Lodging</a>` : ""}
          ${dest.flightsUrl ? `<a href="${dest.flightsUrl}" target="_blank" rel="noopener noreferrer" style="font-size:10px;font-weight:500;color:#71717a;text-decoration:none;display:inline-flex;align-items:center;gap:2px;" onmouseover="this.style.color='#ea580c'" onmouseout="this.style.color='#71717a'">&#9992; Flights</a>` : ""}
          ${dest.carsUrl ? `<a href="${dest.carsUrl}" target="_blank" rel="noopener noreferrer" style="font-size:10px;font-weight:500;color:#71717a;text-decoration:none;display:inline-flex;align-items:center;gap:2px;" onmouseover="this.style.color='#ea580c'" onmouseout="this.style.color='#71717a'">&#128663; Cars</a>` : ""}
        </div>` : ""}
        ${meetsFilter ? `<div style="height:2px;background:linear-gradient(to right,#fb923c,#f97316);border-radius:2px;margin-top:8px;"></div>` : ""}
      </div>`;
    };

    // Add or update markers
    destinations.forEach((dest) => {
      const isSelected = dest.id === selectedDestination;
      const meetsFilter = dest.meetsFilter === true;

      const markerOptions: L.CircleMarkerOptions = {
        radius: isSelected ? 12 : 8,
        fillColor: meetsFilter ? "#f97316" : "#94a3b8",
        color: isSelected ? "#0a0a0a" : "#ffffff",
        weight: isSelected ? 3 : 2,
        opacity: 1,
        fillOpacity: 0.9,
      };

      if (existingMarkers.has(dest.id)) {
        const marker = existingMarkers.get(dest.id)!;
        marker.setLatLng([dest.lat, dest.lon]);
        marker.setStyle(markerOptions);
        // Update tooltip content
        const tempText = dest.maxTemp !== undefined ? `${dest.maxTemp}°F today` : "Loading...";
        const filterStatus = meetsFilter ? `${filterLabel} this week` : "Outside range";
        marker.setTooltipContent(
          `<strong>${dest.name}, ${dest.state}</strong><br/>${tempText}<br/><em>${filterStatus}</em>`
        );
      } else {
        const marker = L.circleMarker([dest.lat, dest.lon], markerOptions)
          .addTo(map)
          .on("click", () => {
            onSelectDestination(dest.id);
          });

        const tempText = dest.maxTemp !== undefined ? `${dest.maxTemp}°F today` : "Loading...";
        const filterStatus = meetsFilter ? `${filterLabel} this week` : "Outside range";
        marker.bindTooltip(
          `<strong>${dest.name}, ${dest.state}</strong><br/>${tempText}<br/><em>${filterStatus}</em>`,
          { direction: "top", offset: [0, -10] }
        );

        existingMarkers.set(dest.id, marker);
      }
    });

    // Show popup for selected destination
    if (selectedDestination && map) {
      const dest = destinations.find(d => d.id === selectedDestination);
      if (dest) {
        // Close any existing popup
        if (activePopupRef.current) {
          map.closePopup(activePopupRef.current);
        }
        const popup = L.popup({
          closeButton: true,
          className: "mini-card-popup",
          maxWidth: 280,
          offset: [0, -12],
        })
          .setLatLng([dest.lat, dest.lon])
          .setContent(buildPopupHtml(dest))
          .openOn(map);
        activePopupRef.current = popup;

        // When popup is closed by user, deselect the destination
        popup.on("remove", () => {
          activePopupRef.current = null;
        });
      }
    } else if (!selectedDestination && activePopupRef.current && map) {
      map.closePopup(activePopupRef.current);
      activePopupRef.current = null;
    }

  }, [destinations, selectedDestination, onSelectDestination, isMapReady, filterLabel]);

  // Pan to selected destination
  useEffect(() => {
    if (!mapRef.current || !selectedDestination || !isMapReady) return;

    const dest = destinations.find((d) => d.id === selectedDestination);
    if (dest) {
      mapRef.current.setView([dest.lat, dest.lon], 8, { animate: true });
    }
  }, [selectedDestination, destinations, isMapReady]);

  // Invalidate size when visibility changes (e.g. mobile list/map toggle)
  useEffect(() => {
    if (!mapRef.current || !isMapReady || !isVisible) return;
    // Small delay to let the container become visible before recalculating
    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [isVisible, isMapReady]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[400px] bg-zinc-100"
      style={{ zIndex: 0 }}
    />
  );
}
