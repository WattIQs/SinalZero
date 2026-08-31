import { useEffect, useRef } from "react";
import type { Lead } from "../lib/types";

export function LeadMap({ leads, selected, onSelect, center }: { leads: Lead[]; selected?: string; onSelect: (lead: Lead) => void; center: { lat: number; lon: number } }) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  useEffect(() => {
    let alive = true;
    void import("leaflet").then((L) => {
      if (!alive || !el.current) return;
      if (!mapRef.current) {
        mapRef.current = L.map(el.current, { zoomControl: false }).setView([center.lat, center.lon], 13);
        L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors" }).addTo(mapRef.current);
      } else mapRef.current.setView([center.lat, center.lon]);
      mapRef.current.eachLayer((layer: any) => { if (layer instanceof L.CircleMarker) mapRef.current.removeLayer(layer); });
      for (const lead of leads) {
        const marker = L.circleMarker([lead.lat, lead.lon], { radius: lead.id === selected ? 10 : 7, weight: 2, color: lead.signals === 3 ? "#16a34a" : lead.signals === 0 ? "#ef4444" : "#f59e0b", fillOpacity: .8 });
        marker.bindTooltip(lead.name, { direction: "top" }); marker.on("click", () => onSelect(lead)); marker.addTo(mapRef.current);
      }
    });
    return () => { alive = false; };
  }, [leads, selected, center.lat, center.lon, onSelect]);
  return <div ref={el} className="map" />;
}
