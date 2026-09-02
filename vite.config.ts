import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    // This app is deployed as a Vercel function. Without the preset, Nitro
    // defaults to node-server and emits an artifact Vercel cannot serve.
    nitro({ preset: "vercel" }),
    viteReact(),
  ],
});
