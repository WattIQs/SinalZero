import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSense({ className = "" }: { className?: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense may not be ready yet; the global script will retry on navigation.
    }
  }, []);

  return (
    <div className={`my-2 flex min-h-[90px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-background/20 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-5020542670198921"
        data-ad-slot="9218732622"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
