import { Radar as RadarIcon } from "lucide-react";

type AreaSearchRadarProps = {
  verifying?: boolean;
};

export function AreaSearchRadar({ verifying = false }: AreaSearchRadarProps) {
  return (
    <>
      <div className={`area-search-radar${verifying ? " area-search-radar--verifying" : ""}`} aria-hidden="true">
        <div className="area-search-radar__glow" />
        <div className="area-search-radar__ring area-search-radar__ring--outer" />
        <div className="area-search-radar__ring area-search-radar__ring--middle" />
        <div className="area-search-radar__ring area-search-radar__ring--inner" />
        <div className="area-search-radar__cross area-search-radar__cross--x" />
        <div className="area-search-radar__cross area-search-radar__cross--y" />
        <div className="area-search-radar__echo area-search-radar__echo--one" />
        <div className="area-search-radar__echo area-search-radar__echo--two" />
        <div className="area-search-radar__sweep" />
        <div className="area-search-radar__beam" />
        <span className="area-search-radar__blip area-search-radar__blip--one" />
        <span className="area-search-radar__blip area-search-radar__blip--two" />
        <span className="area-search-radar__blip area-search-radar__blip--three" />
        <div className="area-search-radar__center"><RadarIcon className="h-4 w-4" strokeWidth={1.8} /></div>
      </div>
      <style>{`
        .area-search-radar{position:relative;width:clamp(76px,25vw,96px);aspect-ratio:1;flex:0 0 clamp(76px,25vw,96px);border-radius:50%;isolation:isolate;contain:paint;display:block;background:radial-gradient(circle,rgba(255,224,122,.12) 0 2px,transparent 3px),radial-gradient(circle,rgba(255,173,0,.08),transparent 68%);border:1px solid rgba(255,173,0,.25);box-shadow:0 0 42px -18px rgba(255,173,0,.76),inset 0 0 28px rgba(255,173,0,.05);overflow:hidden;clip-path:circle(50% at 50% 50%);-webkit-clip-path:circle(50% at 50% 50%);transform:translateZ(0);animation:sz-radar-breathe 3.2s ease-in-out infinite}
        .area-search-radar::after{content:"";position:absolute;inset:0;z-index:3;border:1px solid rgba(255,224,122,.12);border-radius:inherit;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2);pointer-events:none}
        .area-search-radar__glow{position:absolute;inset:15%;border-radius:50%;background:rgba(255,173,0,.13);filter:blur(13px);animation:sz-radar-glow 2.8s ease-in-out infinite}
        .area-search-radar__ring{position:absolute;left:50%;top:50%;border-radius:50%;transform:translate(-50%,-50%);border:1px solid rgba(255,173,0,.15)}
        .area-search-radar__ring--outer{width:82px;height:82px}.area-search-radar__ring--middle{width:58px;height:58px}.area-search-radar__ring--inner{width:30px;height:30px;border-color:rgba(255,224,122,.34)}
        .area-search-radar__cross{position:absolute;left:50%;top:50%;background:rgba(255,173,0,.075);transform:translate(-50%,-50%)}
        .area-search-radar__cross--x{width:100%;height:1px}.area-search-radar__cross--y{width:1px;height:100%}
        .area-search-radar__echo{position:absolute;left:50%;top:50%;width:24px;height:24px;border:1px solid rgba(255,224,122,.55);border-radius:50%;transform:translate(-50%,-50%) scale(.35);opacity:0;animation:sz-radar-echo 2.8s cubic-bezier(.15,.65,.3,1) infinite}.area-search-radar__echo--two{animation-delay:1.4s}
        .area-search-radar__sweep{position:absolute;inset:4px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,transparent 296deg,rgba(255,173,0,.05) 320deg,rgba(255,224,122,.82) 348deg,transparent 360deg);-webkit-mask:radial-gradient(circle,transparent 0 48%,#000 49% 51%,transparent 52%);mask:radial-gradient(circle,transparent 0 48%,#000 49% 51%,transparent 52%);transform-origin:50% 50%;animation:sz-radar-sweep 2.45s linear infinite}
        .area-search-radar__beam{position:absolute;inset:4px;border-radius:50%;background:conic-gradient(from -12deg,rgba(255,224,122,.22),rgba(255,173,0,.05) 18deg,transparent 46deg);transform-origin:50% 50%;animation:sz-radar-sweep 2.45s linear infinite}
        .area-search-radar__center{position:absolute;left:50%;top:50%;width:22px;height:22px;display:grid;place-items:center;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(255,173,0,.32);background:rgba(8,8,8,.72);color:#ffad00;box-shadow:0 0 14px -8px rgba(255,173,0,.9)}
        .area-search-radar__blip{position:absolute;width:4px;height:4px;border-radius:50%;background:#ffe07a;box-shadow:0 0 9px 3px rgba(255,173,0,.62);opacity:.7;animation:sz-radar-blip 2.45s ease-in-out infinite}
        .area-search-radar__blip--one{left:26px;top:30px;animation-delay:.3s}.area-search-radar__blip--two{right:20px;top:45px;animation-delay:1.2s}.area-search-radar__blip--three{left:40px;bottom:17px;animation-delay:1.9s}
        @keyframes sz-radar-sweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes sz-radar-breathe{0%,100%{box-shadow:0 0 34px -20px rgba(255,173,0,.58)}50%{box-shadow:0 0 48px -16px rgba(255,173,0,.92)}}@keyframes sz-radar-glow{0%,100%{opacity:.35;transform:scale(.82)}50%{opacity:.9;transform:scale(1.16)}}@keyframes sz-radar-echo{0%{opacity:.8;transform:translate(-50%,-50%) scale(.3)}72%,100%{opacity:0;transform:translate(-50%,-50%) scale(3.65)}}
        @keyframes sz-radar-blip{0%,100%{transform:scale(.72);opacity:.28}45%{transform:scale(1.35);opacity:.95}65%{transform:scale(.9);opacity:.55}}
        .area-search-radar--verifying{border-color:rgba(103,232,249,.36);box-shadow:0 0 46px -17px rgba(34,211,238,.7),inset 0 0 28px rgba(34,211,238,.06)}.area-search-radar--verifying .area-search-radar__ring{border-color:rgba(103,232,249,.22)}.area-search-radar--verifying .area-search-radar__sweep{filter:hue-rotate(115deg)}.area-search-radar--verifying .area-search-radar__blip{background:#a5f3fc}
        @media(prefers-reduced-motion:reduce){.area-search-radar,.area-search-radar__glow,.area-search-radar__sweep,.area-search-radar__beam,.area-search-radar__echo,.area-search-radar__blip{animation:none!important}.area-search-radar__echo,.area-search-radar__beam{display:none}}
      `}</style>
    </>
  );
}
