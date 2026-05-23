"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { CampingItem, MarkerTier } from "@/types";
import { MAP_CENTER, MAP_ZOOM } from "@/lib/constants";
import { CampPopupContent } from "@/components/map/camp-popup";

const TIER_STYLE: Record<
  MarkerTier,
  { bg: string; border: string; emoji: string; size: number; fontSize: number; color: string }
> = {
  best: { bg: "#EF4444", border: "#B91C1C", emoji: "★", size: 13, fontSize: 6, color: "#FFFFFF" },
  high: { bg: "#FEF08A", border: "#EAB308", emoji: "●", size: 10, fontSize: 4, color: "#78350f" },
  low: { bg: "#E2E8F0", border: "#94A3B8", emoji: "●", size: 9, fontSize: 4, color: "#64748b" },
};

function makeIcon(tier: MarkerTier) {
  const s = TIER_STYLE[tier];
  return L.divIcon({
    className: "",
    html: `<div style="width:${s.size}px;height:${s.size}px;background:${s.bg};border:1px solid ${s.border};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${s.fontSize}px;font-weight:bold;color:${s.color};box-shadow:0 1px 4px rgba(0,0,0,.25);">${s.emoji}</div>`,
    iconSize: [s.size, s.size],
    iconAnchor: [s.size / 2, s.size / 2],
    popupAnchor: [0, -s.size / 2],
  });
}

function MapResize() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

function FitBounds({ camps }: { camps: CampingItem[] }) {
  const map = useMap();
  useEffect(() => {
    if (camps.length === 0) return;
    const bounds = L.latLngBounds(camps.map((c) => [c.lat, c.lon]));
    map.fitBounds(bounds.pad(0.15));
    setTimeout(() => map.invalidateSize(), 200);
  }, [camps, map]);
  return null;
}

export function CampingMap({ camps }: { camps: CampingItem[] }) {
  const [ready, setReady] = useState(false);
  const markers = useMemo(
    () => camps.filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lon)),
    [camps]
  );

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex h-[560px] w-full items-center justify-center rounded-2xl border border-amber-200/60 bg-amber-50/40">
        <p className="text-sm text-amber-800">지도 준비 중...</p>
      </div>
    );
  }

  return (
    <div className="h-[560px] w-full overflow-hidden rounded-2xl border border-amber-200/60 shadow-inner">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResize />
        <FitBounds camps={markers} />
        {markers.map((camp) => (
          <Marker
            key={camp.id}
            position={[camp.lat, camp.lon]}
            icon={makeIcon(camp.markerTier)}
          >
            <Popup maxWidth={320} minWidth={240}>
              <CampPopupContent camp={camp} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
