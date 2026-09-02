import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Layer, Map } from "leaflet";
import type { Establishment } from "../lib/types";

type LeadMapProps = {
  leads: Establishment[];
  selected?: string;
  onSelect: (lead: Establishment) => void;
  center: { lat: number; lon: number };
};

export function LeadMap({ leads, selected, onSelect, center }: LeadMapProps) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    let alive = true;

    void import("leaflet").then((L) => {
      if (!alive || !el.current || mapRef.current) return;

      mapRef.current = L.map(el.current, { zoomControl: false }).setView([center.lat, center.lon], 13);
      L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    });

    return () => {
      alive = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    void import("leaflet").then((L) => {
      const map = mapRef.current;
      if (!alive || !map) return;

      map.setView([center.lat, center.lon]);
      map.eachLayer((layer: Layer) => {
        if (layer instanceof L.CircleMarker) map.removeLayer(layer);
      });

      for (const lead of leads) {
        const marker = L.circleMarker([lead.lat, lead.lon], {
          radius: lead.id === selected ? 10 : 7,
          weight: 2,
          color: lead.signalCount >= 3 ? "#16a34a" : lead.signalCount === 0 ? "#ef4444" : "#f59e0b",
          fillOpacity: 0.8,
        });
        marker.bindTooltip(lead.name, { direction: "top" });
        marker.on("click", () => onSelect(lead));
        marker.addTo(map);
      }
    });

    return () => {
      alive = false;
    };
  }, [leads, selected, center.lat, center.lon, onSelect]);

  return <div ref={el} className="map" />;
}
