import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { takeRateLimit } from "./rate-limit";

function enforce(scope: string, limit: number) {
  // Vercel supplies this header; do not trust client-provided identity claims.
  const address =
    getRequestHeader("x-vercel-forwarded-for") ?? getRequestHeader("x-forwarded-for") ?? "unknown";
  if (!takeRateLimit(`${scope}:${address.split(",")[0]?.trim().slice(0, 80)}`, limit)) {
    throw new Error("Muitas solicitações em sequência. Aguarde um minuto para continuar.");
  }
}

export const searchRateLimitMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    enforce("suggest", 120);
    return next();
  },
);
export const scanRateLimitMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    enforce("scan", 30);
    return next();
  },
);
export const verificationRateLimitMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    enforce("verify", 120);
    return next();
  },
);
