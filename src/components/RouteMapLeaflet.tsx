"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import polyline from "@mapbox/polyline";

type LatLngTuple = [number, number];

const AnyMapContainer = MapContainer as unknown as React.ComponentType<Record<string, unknown>>;
const AnyTileLayer = TileLayer as unknown as React.ComponentType<Record<string, unknown>>;
const AnyPolyline = Polyline as unknown as React.ComponentType<Record<string, unknown>>;
const AnyMarker = Marker as unknown as React.ComponentType<Record<string, unknown>>;

export function RouteMapLeaflet({ polylineText, locationLabel }: { polylineText?: string; locationLabel?: string }) {
  const decoded = useMemo<LatLngTuple[]>(() => {
    if (!polylineText) return [];
    try {
      return polyline.decode(polylineText).map(([lat, lng]) => [lat, lng] as LatLngTuple);
    } catch {
      return [];
    }
  }, [polylineText]);

  const [geocodedCenter, setGeocodedCenter] = useState<LatLngTuple | null>(null);

  useEffect(() => {
    let active = true;
    if (decoded.length || !locationLabel) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationLabel)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const first = Array.isArray(data) ? data[0] : null;
        if (first?.lat && first?.lon) {
          setGeocodedCenter([Number(first.lat), Number(first.lon)]);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [decoded.length, locationLabel]);

  const center = decoded[Math.floor(decoded.length / 2)] ?? geocodedCenter ?? [-23.5631, -46.6544];
  const zoom = decoded.length ? 13 : geocodedCenter ? 14 : 11;

  return (
    <div className="mt-3 overflow-hidden rounded-[22px] border border-white/10 bg-slate-950">
      <div className="h-[320px] w-full">
        <AnyMapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
          <AnyTileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {decoded.length ? <AnyPolyline positions={decoded} pathOptions={{ color: "#22d3ee", weight: 6 }} /> : null}
          {!decoded.length && geocodedCenter ? <AnyMarker position={geocodedCenter} /> : null}
        </AnyMapContainer>
      </div>
    </div>
  );
}
