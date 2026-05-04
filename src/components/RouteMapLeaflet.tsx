"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import polyline from "@mapbox/polyline";

const AnyMapContainer = MapContainer as unknown as React.ComponentType<Record<string, unknown>>;
const AnyTileLayer = TileLayer as unknown as React.ComponentType<Record<string, unknown>>;
const AnyPolyline = Polyline as unknown as React.ComponentType<Record<string, unknown>>;

export function RouteMapLeaflet({ polylineText }: { polylineText: string }) {
  const decoded = polyline.decode(polylineText).map(([lat, lng]) => [lat, lng] as [number, number]);
  const center = decoded[Math.floor(decoded.length / 2)] ?? [-23.5631, -46.6544];

  return (
    <div className="mt-3 overflow-hidden rounded-[22px] border border-white/10 bg-slate-950">
      <div className="h-[320px] w-full">
        <AnyMapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
          <AnyTileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AnyPolyline positions={decoded} pathOptions={{ color: "#22d3ee", weight: 6 }} />
        </AnyMapContainer>
      </div>
    </div>
  );
}
