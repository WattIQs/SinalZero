import { Radar as RadarIcon } from "lucide-react";

type AreaSearchRadarProps = {
  verifying?: boolean;
};

export function AreaSearchRadar({ verifying = false }: AreaSearchRadarProps) {
  return (
    <div className="area-search-radar" aria-hidden="true">
      <div className="area-search-radar__ring area-search-radar__ring--outer" />
      <div className="area-search-radar__ring area-search-radar__ring--middle" />
      <div className="area-search-radar__ring area-search-radar__ring--inner" />
      <div className="area-search-radar__cross area-search-radar__cross--x" />
      <div className="area-search-radar__cross area-search-radar__cross--y" />
      <div className="area-search-radar__sweep" />
      <span className="area-search-radar__blip area-search-radar__blip--one" />
      <span className="area-search-radar__blip area-search-radar__blip--two" />
      <span className="area-search-radar__blip area-search-radar__blip--three" />
      <div className="area-search-radar__center"><RadarIcon className="h-4 w-4" strokeWidth={1.8} /></div>
      <span className="area-search-radar__label">{verifying ? "PRESENÇA" : "VARRER"}</span>
    </div>
  );
}
