import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import {
  higgsfieldDesignInspectorVitePlugin,
  higgsfieldDesignSourceBabelPlugin,
} from "./src/module/design-inspector/vite";
import svgr from "vite-plugin-svgr";
import { defaultServerConditions, defineConfig } from "vite";
import { fileURLToPath } from "node:url";

// The vendored @higgsfield/quanta components import their glyphs from the private
// Nexus-only `@higgsfield-ai/icons`. Generated sites build on the PUBLIC npm
// registry, so we redirect every `@higgsfield-ai/icons/*` import to a lucide
// shim instead (see src/lib/quanta-icons.ts). tsconfig.json has
// the matching `paths` entry so type-checking resolves it too.
const QUANTA_ICONS_SHIM = fileURLToPath(
  new URL("./src/lib/quanta-icons.ts", import.meta.url),
);

// Two deploy targets share this config:
// - "higgsfield" (default): the Cloudflare-Worker build the Higgsfield platform
//   deploys (custom `src/server.ts` entry, edge-bundled SSR).
// - "vercel": Vercel via nitro's Build Output API preset. The three pages are
//   prerendered to static HTML at build time; /robots.txt and /sitemap.xml
//   stay server routes on the serverless fallback. Vercel sets VERCEL=1 itself,
//   DEPLOY_TARGET=vercel forces it locally.
const deployTarget = process.env.DEPLOY_TARGET ?? (process.env.VERCEL ? "vercel" : "higgsfield");
const isVercel = deployTarget === "vercel";

// Mirrors src/lib/security-headers.server.ts, which only runs inside the
// Worker entry. On Vercel the headers are attached through nitro route rules.
const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; media-src 'self' blob: https:; " +
    "connect-src 'self' https:; " +
    "frame-src 'self' https://www.instagram.com; " +
    "base-uri 'self'; form-action 'self'",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-XSS-Protection": "0",
};

export default defineConfig(({ command, mode }) => {
  const designInspectorEnabled = process.env.HF_DESIGN_INSPECTOR === "1" || mode === "design";

  return {
    // fsevents can miss edits under some setups (bun-launched dev, synced/virtual
    // dirs), leaving HMR dead so changes only appear after a manual restart.
    // Polling the watcher makes file changes reliably trigger HMR / SSR reload.
    server: {
      watch: { usePolling: true, interval: 150 },
    },
    resolve: {
      tsconfigPaths: true,
      alias: [{ find: /^@higgsfield-ai\/icons(\/.*)?$/, replacement: QUANTA_ICONS_SHIM }],
    },
    // Higgsfield target only: the server bundle runs as a Cloudflare Worker with
    // no node_modules at runtime, so every dependency is bundled in and resolved
    // through the edge export conditions. `vite dev` and the Vercel (Node) build
    // keep Vite's default SSR behaviour.
    ssr: isVercel
      ? {}
      : {
          ...(command === "build"
            ? {
                target: "webworker" as const,
                resolve: {
                  conditions: [
                    "workerd",
                    "worker",
                    "browser",
                    ...defaultServerConditions.filter((c) => c !== "node"),
                  ],
                },
              }
            : {}),
          noExternal: command === "build" ? true : undefined,
          // `cloudflare:workers` is a workerd runtime built-in that exposes the
          // Worker env / bindings. It must NOT be bundled; the runtime provides it.
          external: ["cloudflare:workers"],
        },
    build: isVercel
      ? {}
      : {
          // Keep `cloudflare:*` external in the SSR rollup pass too.
          rollupOptions: { external: [/^cloudflare:/] },
        },
    plugins: [
      // Local SVG assets import as React components via `?react`.
      svgr({
        svgrOptions: {
          icon: true,
          svgProps: { fill: "currentColor" },
          svgoConfig: {
            plugins: [{ name: "preset-default", params: { overrides: { removeViewBox: false } } }],
          },
        },
      }),
      // TanStack Start plugin must run before React's plugin.
      //
      // Higgsfield: `vite build` emits a Workers-shaped server bundle
      // (dist/server/server.js, `export default { fetch }`) plus dist/client.
      // Vercel: nitro owns the server entry; the public pages are prerendered.
      // Either way rendering happens on the server, so site code must be
      // SSR-safe (no browser globals during render or at module top level).
      tanstackStart(
        isVercel
          ? {
              prerender: {
                enabled: true,
                crawlLinks: true,
                failOnError: true,
              },
              pages: [{ path: "/" }, { path: "/impressum" }, { path: "/datenschutz" }],
            }
          : { server: { entry: "server" } },
      ),
      ...(isVercel
        ? [
            nitro({
              preset: "vercel",
              routeRules: {
                "/**": { headers: SECURITY_HEADERS },
              },
            }),
          ]
        : []),
      higgsfieldDesignInspectorVitePlugin(designInspectorEnabled),
      react({
        babel: {
          plugins: designInspectorEnabled ? [higgsfieldDesignSourceBabelPlugin] : [],
        },
      }),
      tailwindcss(),
    ],
  };
});
