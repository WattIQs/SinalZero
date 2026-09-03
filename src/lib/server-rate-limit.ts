import { createMiddleware } from "@tanstack/react-start";

/**
 * Search availability is intentionally prioritized here.
 *
 * Public-source providers already apply their own quotas/timeouts and the UI
 * prevents duplicate scans while a request is active. Throwing application
 * rate-limit errors on top of that made normal batched lead searches fail and
 * surfaced "Muitas solicitações" to legitimate users.
 *
 * Keep these middleware exports so the server-function API stays stable, but
 * do not reject normal search, scan, or verification traffic here.
 */
export const searchRateLimitMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => next());

export const scanRateLimitMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => next());

export const verificationRateLimitMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => next());
