import { useEffect, useRef } from "react";
import { Radar as RadarIcon } from "lucide-react";

type AreaSearchRadarProps = { verifying?: boolean };

export function AreaSearchRadar({ verifying = false }: AreaSearchRadarProps) {
  const radarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const radar = radarRef.current;
    if (!radar || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active = true;
    let revert: (() => void) | undefined;

    void import("gsap").then(({ gsap }) => {
      if (!active) return;
      const context = gsap.context(() => {
        gsap.to(".area-search-radar__sweep, .area-search-radar__beam", { rotation: 360, duration: 3.6, ease: "none", repeat: -1 });
        gsap.to(".area-search-radar__ambient", { scale: 1.025, opacity: 1, duration: 1.9, ease: "sine.inOut", repeat: -1, yoyo: true });
        gsap.to(".area-search-radar__center", { scale: 1.075, duration: 1.15, ease: "sine.inOut", repeat: -1, yoyo: true });
        gsap.utils.toArray<HTMLElement>(".area-search-radar__blip").forEach((blip, index) => {
          gsap.fromTo(blip, { scale: 0.58, opacity: 0.18 }, { scale: 1.5, opacity: 1, duration: 0.34, delay: index * 0.32, ease: "power2.out", repeat: -1, repeatDelay: 1.85, yoyo: true });
        });
      }, radar);
      revert = () => context.revert();
    });

    return () => { active = false; revert?.(); };
  }, []);

  return (
    <>
      <div ref={radarRef} className={`area-search-radar${verifying ? " area-search-radar--verifying" : ""}`} aria-hidden="true">
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
        {Array.from({ length: 8 }, (_, index) => <span key={index} className={`area-search-radar__blip area-search-radar__blip--${index + 1}`} />)}
        <div className="area-search-radar__center"><RadarIcon className="area-search-radar__icon" strokeWidth={1.8} /></div>
      </div>
      <style>{`
        .area-search-radar{position:absolute;inset:0;z-index:1;width:100%;height:100%;isolation:isolate;overflow:hidden;pointer-events:none;transform:translateZ(0);contain:layout paint style}
        .area-search-radar__field{position:absolute;inset:0;background:radial-gradient(ellipse 108% 196% at 50% 50%,rgba(255,173,0,.09) 0%,rgba(255,173,0,.045) 38%,transparent 78%),linear-gradient(90deg,transparent 49.94%,rgba(255,173,0,.09) 50%,transparent 50.06%),linear-gradient(0deg,transparent 49.94%,rgba(255,173,0,.09) 50%,transparent 50.06%)}
        .area-search-radar__field::before,.area-search-radar__field::after{content:"";position:absolute;inset:0;pointer-events:none}.area-search-radar__field::before{background:repeating-radial-gradient(ellipse 108% 196% at 50% 50%,transparent 0 10.8%,rgba(255,173,0,.10) 10.95% 11.08%,transparent 11.22% 21.7%);opacity:.7}.area-search-radar__field::after{background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,173,0,.065) 0deg .4deg,transparent .4deg 15deg);opacity:.38}
        .area-search-radar__ambient{position:absolute;left:-20%;right:-20%;top:-90%;bottom:-90%;border-radius:50%;background:radial-gradient(ellipse at 50% 50%,rgba(255,173,0,.105) 0%,rgba(255,173,0,.04) 30%,transparent 62%);transform:scale(.98)}
        .area-search-radar__axis{position:absolute;z-index:1;background:rgba(255,173,0,.09)}.area-search-radar__axis--x{left:0;right:0;top:50%;height:1px}.area-search-radar__axis--y{top:0;bottom:0;left:50%;width:1px}
        .area-search-radar__ring{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(255,173,0,.20);box-shadow:0 0 36px -28px rgba(255,173,0,.95)}.area-search-radar__ring--outer{width:138%;height:276%;opacity:.55}.area-search-radar__ring--middle{width:104%;height:208%;opacity:.70}.area-search-radar__ring--inner{width:72%;height:144%;opacity:.86}.area-search-radar__ring--core{width:40%;height:80%;border-color:rgba(255,205,85,.32)}
        .area-search-radar__echo{position:absolute;left:50%;top:50%;width:16%;height:32%;border:1px solid rgba(255,205,85,.52);border-radius:50%;transform:translate(-50%,-50%) scale(.45);opacity:0;animation:sz-radar-echo 3.2s cubic-bezier(.15,.65,.3,1) infinite}.area-search-radar__echo--two{animation-delay:1.6s}
        .area-search-radar__sweep,.area-search-radar__beam{position:absolute;left:-55%;right:-55%;top:-160%;bottom:-160%;transform:rotate(0deg);transform-origin:50% 50%;will-change:transform}
        .area-search-radar__sweep{background:conic-gradient(from -9deg at 50% 50%,transparent 0 320deg,rgba(255,173,0,.035) 330deg,rgba(255,205,85,.28) 347deg,rgba(255,230,145,.82) 355deg,transparent 360deg);-webkit-mask:radial-gradient(ellipse 34% 56% at 50% 50%,transparent 0 10%,#000 11% 100%);mask:radial-gradient(ellipse 34% 56% at 50% 50%,transparent 0 10%,#000 11% 100%)}
        .area-search-radar__beam{background:conic-gradient(from -10deg at 50% 50%,rgba(255,224,122,.44),rgba(255,173,0,.18) 13deg,rgba(255,173,0,.055) 31deg,transparent 54deg);opacity:.92}
        .area-search-radar__center{position:absolute;left:50%;top:50%;z-index:4;width:clamp(60px,5vw,88px);height:clamp(60px,5vw,88px);display:grid;place-items:center;transform:translate(-50%,-50%);border-radius:18px;border:1px solid rgba(255,205,85,.58);background:#0a0907;color:#ffad00;box-shadow:0 0 0 1px rgba(255,173,0,.10),0 14px 30px -24px rgba(255,173,0,.8),inset 0 0 16px rgba(255,173,0,.05)}.area-search-radar__icon{width:48%;height:48%}
        .area-search-radar__blip{position:absolute;z-index:3;width:7px;height:7px;border-radius:50%;background:#ffbf3f;box-shadow:0 0 11px 3px rgba(255,173,0,.58);opacity:.18;will-change:transform,opacity}.area-search-radar__blip--1{left:8%;top:8%}.area-search-radar__blip--2{left:79%;top:7%}.area-search-radar__blip--3{left:91%;top:84%}.area-search-radar__blip--4{left:7%;top:91%}.area-search-radar__blip--5{left:35%;top:4%}.area-search-radar__blip--6{left:64%;top:94%}.area-search-radar__blip--7{left:23%;top:56%}.area-search-radar__blip--8{left:82%;top:46%}
        @keyframes sz-radar-echo{0%{opacity:.58;transform:translate(-50%,-50%) scale(.4)}78%,100%{opacity:0;transform:translate(-50%,-50%) scale(6)}}
        .area-search-radar--verifying .area-search-radar__ring{border-color:rgba(255,190,55,.24)}.area-search-radar--verifying .area-search-radar__beam{opacity:.98}.area-search-radar--verifying .area-search-radar__blip{background:#ffd56b}
        @media(min-width:1600px){.area-search-radar__ring--outer{width:148%;height:296%}.area-search-radar__ring--middle{width:112%;height:224%}.area-search-radar__ring--inner{width:78%;height:156%}}
        @media(max-width:700px){.area-search-radar__ring--outer{width:178%;height:266%}.area-search-radar__ring--middle{width:132%;height:202%}.area-search-radar__ring--inner{width:90%;height:138%}.area-search-radar__ring--core{width:52%;height:80%}.area-search-radar__sweep,.area-search-radar__beam{left:-78%;right:-78%;top:-154%;bottom:-154%}.area-search-radar__center{width:60px;height:60px;border-radius:16px}.area-search-radar__blip{width:5px;height:5px}}
        @media(max-width:700px) and (orientation:portrait){.area-search-radar__ring--outer{width:210%;height:236%}.area-search-radar__ring--middle{width:158%;height:178%}.area-search-radar__ring--inner{width:108%;height:122%}.area-search-radar__ring--core{width:62%;height:70%}.area-search-radar__sweep,.area-search-radar__beam{left:-95%;right:-95%;top:-125%;bottom:-125%}}
        @media(max-height:560px) and (min-width:701px){.area-search-radar__ring--outer{width:118%;height:250%}.area-search-radar__ring--middle{width:90%;height:188%}.area-search-radar__ring--inner{width:62%;height:130%}.area-search-radar__center{width:56px;height:56px}}
        @media(prefers-reduced-motion:reduce){.area-search-radar__ambient,.area-search-radar__sweep,.area-search-radar__beam,.area-search-radar__echo,.area-search-radar__blip{animation:none!important}.area-search-radar__echo,.area-search-radar__beam{display:none}}
      `}</style>
    </>
  );
}

