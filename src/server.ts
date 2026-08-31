import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

export default createServerEntry({
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/health") return new Response(JSON.stringify({ status: "ok", service: "sinal-zero" }), { status: 200, headers: { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" } });
    return handler.fetch(request);
  },
});
