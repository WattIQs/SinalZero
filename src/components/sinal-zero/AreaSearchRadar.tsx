import { Radar as RadarIcon } from "lucide-react";

type AreaSearchRadarProps = { verifying?: boolean };

export function AreaSearchRadar({ verifying = false }: AreaSearchRadarProps) {
  return (
    <>
      <div className={`area-search-radar${verifying ? " area-search-radar--verifying" : ""}`} aria-hidden="true">
        <div className="area-search-radar__field" />
        <div className="area-search-radar__ambient" />
        <i className="area-search-radar__corner area-search-radar__corner--nw" />
        <i className="area-search-radar__corner area-search-radar__corner--ne" />
        <i className="area-search-radar__corner area-search-radar__corner--se" />
        <i className="area-search-radar__corner area-search-radar__corner--sw" />
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
        .area-search-radar{position:absolute;inset:0;z-index:1;width:100%;height:100%;isolation:isolate;overflow:hidden;pointer-events:none;transform:translateZ(0)}
        .area-search-radar__field{position:absolute;inset:0;background:radial-gradient(ellipse 72% 184% at 50% 50%,rgba(255,173,0,.09) 0%,rgba(255,173,0,.045) 32%,transparent 72%),linear-gradient(90deg,transparent 49.94%,rgba(255,173,0,.09) 50%,transparent 50.06%),linear-gradient(0deg,transparent 49.94%,rgba(255,173,0,.09) 50%,transparent 50.06%)}
        .area-search-radar__field::before,.area-search-radar__field::after{content:"";position:absolute;inset:0;pointer-events:none}.area-search-radar__field::before{background:repeating-radial-gradient(ellipse 72% 184% at 50% 50%,transparent 0 10.8%,rgba(255,173,0,.10) 10.95% 11.08%,transparent 11.22% 21.7%);opacity:.7}.area-search-radar__field::after{background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,173,0,.065) 0deg .4deg,transparent .4deg 15deg);opacity:.38;-webkit-mask:radial-gradient(ellipse 78% 196% at 50% 50%,#000 0 96%,transparent 100%);mask:radial-gradient(ellipse 78% 196% at 50% 50%,#000 0 96%,transparent 100%)}
        .area-search-radar__ambient{position:absolute;left:-20%;right:-20%;top:-90%;bottom:-90%;border-radius:50%;background:radial-gradient(ellipse at 50% 50%,rgba(255,173,0,.105) 0%,rgba(255,173,0,.04) 30%,transparent 62%);animation:sz-radar-ambient 3.8s ease-in-out infinite}
        .area-search-radar__corner{position:absolute;z-index:1;width:23%;aspect-ratio:1;overflow:hidden;opacity:.72;animation:sz-radar-corner 2.8s ease-in-out infinite}.area-search-radar__corner::before{content:"";position:absolute;width:190%;height:190%;border-radius:50%;border:1px solid rgba(255,173,0,.27);background:repeating-radial-gradient(circle,transparent 0 16px,rgba(255,173,0,.16) 17px 18px,transparent 19px 34px)}.area-search-radar__corner::after{content:"";position:absolute;width:190%;height:190%;border-radius:50%;background:conic-gradient(from 0deg,rgba(255,230,145,.66),rgba(255,173,0,.16) 16deg,transparent 42deg);animation:sz-radar-corner-sweep 2.8s linear infinite}.area-search-radar__corner--nw{left:0;top:0}.area-search-radar__corner--nw::before,.area-search-radar__corner--nw::after{left:-90%;top:-90%}.area-search-radar__corner--ne{right:0;top:0;animation-delay:-.7s}.area-search-radar__corner--ne::before,.area-search-radar__corner--ne::after{right:-90%;top:-90%;transform:scaleX(-1)}.area-search-radar__corner--se{right:0;bottom:0;animation-delay:-1.4s}.area-search-radar__corner--se::before,.area-search-radar__corner--se::after{right:-90%;bottom:-90%;transform:scale(-1)}.area-search-radar__corner--sw{left:0;bottom:0;animation-delay:-2.1s}.area-search-radar__corner--sw::before,.area-search-radar__corner--sw::after{left:-90%;bottom:-90%;transform:scaleY(-1)}
        .area-search-radar__axis{position:absolute;z-index:1;background:rgba(255,173,0,.09)}.area-search-radar__axis--x{left:0;right:0;top:50%;height:1px}.area-search-radar__axis--y{top:0;bottom:0;left:50%;width:1px}
        .area-search-radar__ring{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(255,173,0,.20);box-shadow:0 0 36px -28px rgba(255,173,0,.95)}.area-search-radar__ring--outer{width:138%;height:276%;opacity:.55}.area-search-radar__ring--middle{width:104%;height:208%;opacity:.70}.area-search-radar__ring--inner{width:72%;height:144%;opacity:.86}.area-search-radar__ring--core{width:40%;height:80%;border-color:rgba(255,205,85,.32)}
        .area-search-radar__echo{position:absolute;left:50%;top:50%;width:16%;height:32%;border:1px solid rgba(255,205,85,.52);border-radius:50%;transform:translate(-50%,-50%) scale(.45);opacity:0;animation:sz-radar-echo 3.2s cubic-bezier(.15,.65,.3,1) infinite}.area-search-radar__echo--two{animation-delay:1.6s}
        .area-search-radar__sweep,.area-search-radar__beam{position:absolute;left:-55%;right:-55%;top:-160%;bottom:-160%;transform:rotate(0deg);transform-origin:50% 50%;animation:sz-radar-sweep 3s linear infinite}
        .area-search-radar__sweep{background:conic-gradient(from -9deg at 50% 50%,transparent 0 320deg,rgba(255,173,0,.045) 330deg,rgba(255,205,85,.32) 347deg,rgba(255,230,145,.72) 355deg,transparent 360deg);-webkit-mask:radial-gradient(ellipse 34% 56% at 50% 50%,transparent 0 10%,#000 11% 100%);mask:radial-gradient(ellipse 34% 56% at 50% 50%,transparent 0 10%,#000 11% 100%);filter:drop-shadow(0 0 22px rgba(255,173,0,.22))}
        .area-search-radar__beam{background:conic-gradient(from -10deg at 50% 50%,rgba(255,224,122,.34),rgba(255,173,0,.16) 13deg,rgba(255,173,0,.045) 31deg,transparent 50deg);-webkit-mask:radial-gradient(ellipse 34% 56% at 50% 50%,transparent 0 10%,#000 11% 100%);mask:radial-gradient(ellipse 34% 56% at 50% 50%,transparent 0 10%,#000 11% 100%);filter:drop-shadow(0 0 18px rgba(255,173,0,.18));opacity:.92}
        .area-search-radar__center{position:absolute;left:50%;top:50%;z-index:4;width:clamp(64px,5vw,88px);height:clamp(64px,5vw,88px);display:grid;place-items:center;transform:translate(-50%,-50%);border-radius:18px;border:1px solid rgba(255,173,0,.35);background:rgba(8,8,8,.94);color:#ffad00;box-shadow:0 0 38px -12px rgba(255,173,0,.82),inset 0 0 20px rgba(255,173,0,.04);backdrop-filter:blur(8px)}.area-search-radar__icon{width:48%;height:48%}
        .area-search-radar__blip{position:absolute;z-index:3;width:7px;height:7px;border-radius:50%;background:#ffbf3f;box-shadow:0 0 11px 3px rgba(255,173,0,.58);opacity:.62;animation:sz-radar-blip 2.7s ease-in-out infinite}.area-search-radar__blip--1{left:8%;top:8%;animation-delay:.2s}.area-search-radar__blip--2{left:79%;top:7%;animation-delay:1s}.area-search-radar__blip--3{left:91%;top:84%;animation-delay:1.8s}.area-search-radar__blip--4{left:7%;top:91%;animation-delay:2.25s}.area-search-radar__blip--5{left:35%;top:4%;animation-delay:.75s}.area-search-radar__blip--6{left:64%;top:94%;animation-delay:1.45s}.area-search-radar__blip--7{left:23%;top:56%;animation-delay:2.05s}.area-search-radar__blip--8{left:82%;top:46%;animation-delay:.45s}
        @keyframes sz-radar-sweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes sz-radar-ambient{0%,100%{opacity:.62;transform:scale(.98)}50%{opacity:1;transform:scale(1.02)}}@keyframes sz-radar-echo{0%{opacity:.58;transform:translate(-50%,-50%) scale(.4)}78%,100%{opacity:0;transform:translate(-50%,-50%) scale(6)}}@keyframes sz-radar-blip{0%,100%{transform:scale(.7);opacity:.24}40%{transform:scale(1.42);opacity:1}64%{transform:scale(.9);opacity:.56}}@keyframes sz-radar-corner{0%,100%{opacity:.32}45%{opacity:.85}}@keyframes sz-radar-corner-sweep{from{rotate:0deg}to{rotate:360deg}}
        .area-search-radar--verifying .area-search-radar__ring{border-color:rgba(255,190,55,.24)}.area-search-radar--verifying .area-search-radar__beam{opacity:.98}.area-search-radar--verifying .area-search-radar__blip{background:#ffd56b}
        @media(max-width:700px){.area-search-radar__ring--outer{width:190%;height:300%}.area-search-radar__ring--middle{width:145%;height:228%}.area-search-radar__ring--inner{width:100%;height:160%}.area-search-radar__ring--core{width:58%;height:96%}.area-search-radar__sweep,.area-search-radar__beam{left:-85%;right:-85%;top:-190%;bottom:-190%}.area-search-radar__blip{width:5px;height:5px}}
        @media(prefers-reduced-motion:reduce){.area-search-radar__ambient,.area-search-radar__corner,.area-search-radar__corner::after,.area-search-radar__sweep,.area-search-radar__beam,.area-search-radar__echo,.area-search-radar__blip{animation:none!important}.area-search-radar__echo,.area-search-radar__beam,.area-search-radar__corner::after{display:none}}
      `}</style>
    </>
  );
}
