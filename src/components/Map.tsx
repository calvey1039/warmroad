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
      } else {
        const marker = L.circleMarker([dest.lat, dest.lon], markerOptions)
          .addTo(map)
          .on("click", () => onSelectDestination(dest.id));

        const tempText = dest.maxTemp !== undefined ? `${dest.maxTemp}°F today` : "Loading...";
        const filterStatus = meetsFilter ? `${filterLabel} this week` : "Outside range";
        marker.bindTooltip(
          `<strong>${dest.name}, ${dest.state}</strong><br/>${tempText}<br/><em>${filterStatus}</em>`,
          { direction: "top", offset: [0, -10] }
        );

        existingMarkers.set(dest.id, marker);
      }
    });

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
