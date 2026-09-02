import { Radar as RadarIcon } from "lucide-react";

type AreaSearchRadarProps = {
  verifying?: boolean;
};

export function AreaSearchRadar({ verifying = false }: AreaSearchRadarProps) {
  return (
    <>
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
      </div>
      <style>{`
        .area-search-radar{position:relative;width:92px;height:92px;flex:0 0 92px;border-radius:50%;isolation:isolate;display:block;background:radial-gradient(circle,rgba(255,173,0,.07) 0 2px,transparent 3px),radial-gradient(circle,rgba(255,173,0,.035),transparent 68%);border:1px solid rgba(255,173,0,.18);box-shadow:0 0 34px -20px rgba(255,173,0,.72);overflow:hidden;transform:translateZ(0);animation:sz-radar-breathe 3.6s ease-in-out infinite}
        .area-search-radar__ring{position:absolute;left:50%;top:50%;border-radius:50%;transform:translate(-50%,-50%);border:1px solid rgba(255,173,0,.15)}
        .area-search-radar__ring--outer{width:78px;height:78px}.area-search-radar__ring--middle{width:56px;height:56px}.area-search-radar__ring--inner{width:30px;height:30px;border-color:rgba(255,173,0,.23)}
        .area-search-radar__cross{position:absolute;left:50%;top:50%;background:rgba(255,173,0,.075);transform:translate(-50%,-50%)}
        .area-search-radar__cross--x{width:100%;height:1px}.area-search-radar__cross--y{width:1px;height:100%}
        .area-search-radar__sweep{position:absolute;inset:4px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,transparent 300deg,rgba(255,173,0,.035) 326deg,rgba(255,224,122,.62) 348deg,transparent 360deg);-webkit-mask:radial-gradient(circle,transparent 0 48%,#000 49% 51%,transparent 52%);mask:radial-gradient(circle,transparent 0 48%,#000 49% 51%,transparent 52%);transform-origin:50% 50%;animation:sz-radar-sweep 2.8s linear infinite}
        .area-search-radar__center{position:absolute;left:50%;top:50%;width:22px;height:22px;display:grid;place-items:center;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(255,173,0,.32);background:rgba(8,8,8,.72);color:#ffad00;box-shadow:0 0 14px -8px rgba(255,173,0,.9)}
        .area-search-radar__blip{position:absolute;width:4px;height:4px;border-radius:50%;background:#ffe07a;box-shadow:0 0 8px 2px rgba(255,173,0,.52);opacity:.7;animation:sz-radar-blip 2.8s ease-in-out infinite}
        .area-search-radar__blip--one{left:26px;top:30px;animation-delay:.3s}.area-search-radar__blip--two{right:20px;top:45px;animation-delay:1.2s}.area-search-radar__blip--three{left:40px;bottom:17px;animation-delay:1.9s}
        @keyframes sz-radar-sweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes sz-radar-breathe{0%,100%{box-shadow:0 0 34px -20px rgba(255,173,0,.58)}50%{box-shadow:0 0 42px -18px rgba(255,173,0,.82)}}
        @keyframes sz-radar-blip{0%,100%{transform:scale(.72);opacity:.28}45%{transform:scale(1.35);opacity:.95}65%{transform:scale(.9);opacity:.55}}
        @media(prefers-reduced-motion:reduce){.area-search-radar,.area-search-radar__sweep,.area-search-radar__blip{animation:none!important}}
      `}</style>
    </>
  );
}
