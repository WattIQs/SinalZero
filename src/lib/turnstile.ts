import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const tokenSchema = z.object({ token: z.string().trim().min(1).max(2048) });
const allowedHostnames = new Set(["zero-sinal.vercel.app"]);

export const verifyTurnstileServer = createServerFn({ method: "POST" })
  .validator((data: unknown) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
    if (!secret) throw new Error("A chave secreta da Cloudflare não está configurada no servidor.");

    let response: Response;
    try {
      response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: data.token }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new Error("Não foi possível conectar à validação da Cloudflare. Tente novamente.");
    }

    let result: { success?: boolean; hostname?: string; "error-codes"?: string[] } = {};
    try {
      result = (await response.json()) as typeof result;
    } catch {
      throw new Error("A resposta da Cloudflare não pôde ser interpretada.");
    }

    const hostnameValid = !!result.hostname && allowedHostnames.has(result.hostname);
    if (result.success === true && hostnameValid) return { success: true };

    const codes = result["error-codes"] ?? [];
    if (codes.includes("invalid-input-secret")) throw new Error("A chave secreta da Cloudflare no Vercel é inválida ou não está ativa.");
    if (codes.includes("missing-input-secret")) throw new Error("A chave secreta da Cloudflare não está disponível no ambiente de produção.");
    if (codes.includes("invalid-input-response") || codes.includes("timeout-or-duplicate")) throw new Error("A verificação da Cloudflare expirou ou já foi utilizada. Faça a verificação novamente.");
    if (!response.ok) throw new Error(`A validação da Cloudflare retornou HTTP ${response.status}. Tente novamente.`);
    if (!hostnameValid) throw new Error("A verificação foi feita fora do domínio autorizado.");
    throw new Error("A Cloudflare recusou a verificação. Faça a verificação novamente.");
  });
