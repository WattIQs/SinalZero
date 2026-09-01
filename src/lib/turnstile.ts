import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const tokenSchema = z.object({ token: z.string().trim().min(1).max(2048) });
const allowedHostnames = new Set(["zero-sinal.vercel.app"]);

export const verifyTurnstileServer = createServerFn({ method: "POST" })
  .validator((data: unknown) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
    if (!secret) throw new Error("Turnstile não está configurado neste ambiente.");

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: data.token }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) throw new Error("A Cloudflare não respondeu à validação.");
    const result = (await response.json()) as { success?: boolean; hostname?: string; "error-codes"?: string[] };
    const hostnameValid = !!result.hostname && allowedHostnames.has(result.hostname);

    if (result.success !== true || !hostnameValid) {
      const codes = result["error-codes"]?.join(", ");
      throw new Error(codes ? `A verificação da Cloudflare foi recusada (${codes}).` : "A verificação da Cloudflare foi recusada. Faça a verificação novamente.");
    }

    return { success: true };
  });
