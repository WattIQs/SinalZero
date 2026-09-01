import { useEffect, useRef } from "react";

declare global {
  interface Window { adsbygoogle?: unknown[]; }
}

export function VerticalAdSense({ className = "" }: { className?: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense may not be ready yet.
    }
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "800px" }}
        data-ad-client="ca-pub-5020542670198921"
        data-ad-slot="3667023041"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
