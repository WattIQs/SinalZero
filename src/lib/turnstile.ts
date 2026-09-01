import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const tokenSchema = z.object({ token: z.string().trim().min(1).max(4096) });

export const verifyTurnstileServer = createServerFn({ method: "POST" })
  .validator((data: unknown) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
    if (!secret) throw new Error("Turnstile não está configurado neste ambiente.");

    const body = new URLSearchParams({ secret, response: data.token });
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Não foi possível validar a proteção anti-bot.");
    const result = (await response.json()) as { success?: boolean; hostname?: string; "error-codes"?: string[] };
    if (result.success !== true) return { success: false };
    return { success: true };
  });
