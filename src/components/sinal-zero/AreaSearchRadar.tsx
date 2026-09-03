import { Radar as RadarIcon } from "lucide-react";

type AreaSearchRadarProps = {
  verifying?: boolean;
};

export function AreaSearchRadar({ verifying = false }: AreaSearchRadarProps) {
  return (
    <>
      <div className={`area-search-radar${verifying ? " area-search-radar--verifying" : ""}`} aria-hidden="true">
        <div className="area-search-radar__field" />
        <div className="area-search-radar__ambient" />
        <div className="area-search-radar__axis area-search-radar__axis--x" />
        <div className="area-search-radar__axis area-search-radar__axis--y" />
        <div className="area-search-radar__ring area-search-radar__ring--outer" />
        <div className="area-search-radar__ring area-search-radar__ring--middle" />
        <div className="area-search-radar__ring area-search-radar__ring--inner" />
        <div className="area-search-radar__ring area-search-radar__ring--core" />
        <div className="area-search-radar__echo area-search-radar__echo--one" />
        <div className="area-search-radar__echo area-search-radar__echo--two" />
        <div className="area-search-radar__sweep" />
        <div className="area-search-radar__beam" />
        <span className="area-search-radar__blip area-search-radar__blip--one" />
        <span className="area-search-radar__blip area-search-radar__blip--two" />
        <span className="area-search-radar__blip area-search-radar__blip--three" />
        <span className="area-search-radar__blip area-search-radar__blip--four" />
        <span className="area-search-radar__blip area-search-radar__blip--five" />
        <span className="area-search-radar__blip area-search-radar__blip--six" />
        <span className="area-search-radar__blip area-search-radar__blip--seven" />
        <span className="area-search-radar__blip area-search-radar__blip--eight" />
        <div className="area-search-radar__center">
          <RadarIcon className="area-search-radar__icon" strokeWidth={1.8} />
        </div>
      </div>
      <style>{`
        .area-search-radar{
          position:absolute;
          inset:0;
          z-index:1;
          width:100%;
          height:100%;
          min-width:100%;
          min-height:100%;
          isolation:isolate;
          overflow:hidden;
          pointer-events:none;
          transform:translateZ(0);
          container-type:size;
          --radar-top:50%;
          --radar-size:max(150cqw,230cqh);
        }
        .area-search-radar__field{
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at 50% 50%,rgba(255,173,0,.075) 0%,rgba(255,173,0,.035) 28%,transparent 68%),
            linear-gradient(90deg,transparent 49.95%,rgba(255,173,0,.07) 50%,transparent 50.05%),
            linear-gradient(0deg,transparent 49.95%,rgba(255,173,0,.07) 50%,transparent 50.05%);
        }
        .area-search-radar__ambient{
          position:absolute;
          left:50%;
          top:var(--radar-top);
          width:var(--radar-size);
          height:var(--radar-size);
          transform:translate(-50%,-50%);
          border-radius:50%;
          background:radial-gradient(circle,rgba(255,173,0,.14) 0%,rgba(255,173,0,.065) 25%,rgba(255,173,0,.025) 54%,transparent 76%);
          filter:blur(2px);
          animation:sz-radar-ambient 3.8s ease-in-out infinite;
        }
        .area-search-radar__axis{position:absolute;z-index:1;background:rgba(255,173,0,.075)}
        .area-search-radar__axis--x{left:0;right:0;top:50%;height:1px}
        .area-search-radar__axis--y{top:0;bottom:0;left:50%;width:1px}
        .area-search-radar__ring{
          position:absolute;
          left:50%;
          top:var(--radar-top);
          width:var(--radar-size);
          height:var(--radar-size);
          border-radius:50%;
          transform:translate(-50%,-50%);
          border:1px solid rgba(255,173,0,.19);
          box-shadow:0 0 32px -26px rgba(255,173,0,.95);
        }
        .area-search-radar__ring--outer{opacity:.52}
        .area-search-radar__ring--middle{width:calc(var(--radar-size) * .76);height:calc(var(--radar-size) * .76);opacity:.68}
        .area-search-radar__ring--inner{width:calc(var(--radar-size) * .53);height:calc(var(--radar-size) * .53);opacity:.84}
        .area-search-radar__ring--core{width:calc(var(--radar-size) * .30);height:calc(var(--radar-size) * .30);border-color:rgba(255,205,85,.30)}
        .area-search-radar__echo{
          position:absolute;
          left:50%;
          top:var(--radar-top);
          width:calc(var(--radar-size) * .13);
          height:calc(var(--radar-size) * .13);
          border:1px solid rgba(255,205,85,.52);
          border-radius:50%;
          transform:translate(-50%,-50%) scale(.45);
          opacity:0;
          animation:sz-radar-echo 3.2s cubic-bezier(.15,.65,.3,1) infinite;
        }
        .area-search-radar__echo--two{animation-delay:1.6s}
        .area-search-radar__sweep,.area-search-radar__beam{
          position:absolute;
          left:50%;
          top:var(--radar-top);
          width:var(--radar-size);
          height:var(--radar-size);
          border-radius:50%;
          transform:translate(-50%,-50%) rotate(0deg);
          transform-origin:50% 50%;
          animation:sz-radar-sweep 3s linear infinite;
        }
        .area-search-radar__sweep{
          background:conic-gradient(from -9deg,transparent 0 320deg,rgba(255,173,0,.05) 330deg,rgba(255,205,85,.40) 347deg,rgba(255,230,145,.78) 355deg,transparent 360deg);
          -webkit-mask:radial-gradient(circle,transparent 0 7%,#000 8% 99%,transparent 100%);
          mask:radial-gradient(circle,transparent 0 7%,#000 8% 99%,transparent 100%);
          filter:drop-shadow(0 0 20px rgba(255,173,0,.24));
        }
        .area-search-radar__beam{
          background:conic-gradient(from -10deg,rgba(255,224,122,.34),rgba(255,173,0,.16) 13deg,rgba(255,173,0,.045) 30deg,transparent 49deg);
          clip-path:polygon(50% 50%,100% 0,100% 58%);
          mix-blend-mode:screen;
          opacity:.9;
        }
        .area-search-radar__center{
          position:absolute;
          left:50%;
          top:var(--radar-top);
          z-index:4;
          width:clamp(64px,5vw,88px);
          height:clamp(64px,5vw,88px);
          display:grid;
          place-items:center;
          transform:translate(-50%,-50%);
          border-radius:18px;
          border:1px solid rgba(255,173,0,.35);
          background:rgba(8,8,8,.94);
          color:#ffad00;
          box-shadow:0 0 38px -12px rgba(255,173,0,.82),inset 0 0 20px rgba(255,173,0,.04);
          backdrop-filter:blur(8px);
        }
        .area-search-radar__icon{width:48%;height:48%}
        .area-search-radar__blip{
          position:absolute;
          z-index:3;
          width:7px;
          height:7px;
          border-radius:50%;
          background:#ffbf3f;
          box-shadow:0 0 11px 3px rgba(255,173,0,.58);
          opacity:.62;
          animation:sz-radar-blip 2.7s ease-in-out infinite;
        }
        .area-search-radar__blip--one{left:11%;top:20%;animation-delay:.2s}
        .area-search-radar__blip--two{left:76%;top:18%;animation-delay:1s}
        .area-search-radar__blip--three{left:88%;top:67%;animation-delay:1.8s}
        .area-search-radar__blip--four{left:9%;top:76%;animation-delay:2.25s}
        .area-search-radar__blip--five{left:36%;top:12%;animation-delay:.75s}
        .area-search-radar__blip--six{left:63%;top:84%;animation-delay:1.45s}
        .area-search-radar__blip--seven{left:24%;top:53%;animation-delay:2.05s}
        .area-search-radar__blip--eight{left:79%;top:48%;animation-delay:.45s}
        @keyframes sz-radar-sweep{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes sz-radar-ambient{0%,100%{opacity:.62;transform:translate(-50%,-50%) scale(.96)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.03)}}
        @keyframes sz-radar-echo{0%{opacity:.58;transform:translate(-50%,-50%) scale(.4)}78%,100%{opacity:0;transform:translate(-50%,-50%) scale(5.5)}}
        @keyframes sz-radar-blip{0%,100%{transform:scale(.7);opacity:.24}40%{transform:scale(1.42);opacity:1}64%{transform:scale(.9);opacity:.56}}
        .area-search-radar--verifying .area-search-radar__ring{border-color:rgba(255,190,55,.22)}
        .area-search-radar--verifying .area-search-radar__beam{opacity:.96}
        .area-search-radar--verifying .area-search-radar__blip{background:#ffd56b}
        @media(max-width:700px){
          .area-search-radar{--radar-size:max(220cqw,250cqh)}
          .area-search-radar__blip{width:5px;height:5px}
        }
        @media(prefers-reduced-motion:reduce){
          .area-search-radar__ambient,.area-search-radar__sweep,.area-search-radar__beam,.area-search-radar__echo,.area-search-radar__blip{animation:none!important}
          .area-search-radar__echo,.area-search-radar__beam{display:none}
        }
      `}</style>
    </>
  );
}
