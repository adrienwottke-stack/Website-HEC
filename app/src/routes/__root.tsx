import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import hecCss from "../hec.css?url";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
// Page metadata (browser <title>/favicon + social og: tags) committed into the
// repo and read at BUILD time. Editing it via the app settings UI rewrites this
// file and redeploys the app.
import appMetaJson from "../app-meta.json";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, THEME_COLOR } from "../hec-content";

declare const __HF_DESIGN_INSPECTOR__: boolean;

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
  // Read by the platform (feed card), never rendered by the app itself.
  marketplace_cover_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

// Arms the ignition veil BEFORE first paint so the intro never flashes the
// finished hero: only when motion is allowed and this session has not seen
// the intro yet. Everything else about the intro lives in client components.
const ARM_IGNITION_SCRIPT =
  '(function(){try{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;' +
  'if(window.sessionStorage.getItem("hec-ignited"))return;' +
  'document.documentElement.setAttribute("data-ignition","armed");}catch(e){}})();';

const APP_HOST_ZONES = ["higgsfield.app", "higgsfield-dev.app"];

// app-meta.json may carry an absolute higgsfield-app URL with a stale host;
// strip it to a root-relative path so it resolves against whoever serves THIS
// page. Genuinely external URLs (a CDN image) are left absolute.
function toOwnAssetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return value;
  try {
    const u = new URL(value);
    const isAppHost = APP_HOST_ZONES.some(
      (zone) => u.hostname === zone || u.hostname.endsWith(`.${zone}`),
    );
    if (isAppHost) return u.pathname + u.search;
    return value;
  } catch {
    return value;
  }
}

function absolute(value: string | null): string | null {
  if (!value) return null;
  return value.startsWith("/") ? `${SITE_URL}${value}` : value;
}

function buildHead(meta: AppMeta) {
  const ogTitle = meta.og_title ?? SITE_NAME;
  const description = meta.og_description ?? SITE_DESCRIPTION;
  const ogImage = absolute(toOwnAssetUrl(meta.og_image_url));
  const favicon = toOwnAssetUrl(meta.favicon_url) ?? "/favicon.svg";
  const ogVideo = absolute(toOwnAssetUrl(meta.og_video_url));

  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: SITE_TITLE },
      { name: "description", content: description },
      { name: "author", content: SITE_NAME },
      { name: "theme-color", content: THEME_COLOR },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "de_DE" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: description },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { name: "twitter:image", content: ogImage },
          ]
        : []),
      ...(ogVideo ? [{ property: "og:video", content: ogVideo }] : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: hecCss },
      { rel: "icon", href: favicon },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/icons/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/icons/favicon-16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/icons/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      {
        rel: "preload",
        href: "/fonts/Satoshi-VariableItalic.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "preload",
        href: "/fonts/Satoshi-Variable.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
      // The mono face carries every label, tag and readout; without a preload
      // it is discovered after CSSOM and all of them swap mid-load.
      {
        rel: "preload",
        href: "/fonts/JetBrainsMono-Regular.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "preload",
        href: "/fonts/JetBrainsMono-Medium.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
    ],
    scripts: [{ children: ARM_IGNITION_SCRIPT }],
  };
}

function NotFoundComponent() {
  return (
    <div className="hec-center">
      <div>
        <h1>Nichts hier.</h1>
        <p>Die Seite gibt es nicht oder nicht mehr.</p>
        <Link to="/">Zur Startseite</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportHiggsfieldError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="hec-center">
      <div>
        <h1>Kurz gestolpert.</h1>
        <p>Die Seite hat nicht geladen. Einmal neu versuchen.</p>
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Neu laden
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html
      lang="de"
      data-theme="default-dark"
      style={{ colorScheme: "dark" }}
      // The inline head script arms data-ignition before hydration on purpose.
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="hec-veil" aria-hidden="true" />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) {
      return;
    }

    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => {
        installHiggsfieldDesignInspector();
      })
      .catch((error) => {
        reportHiggsfieldError(
          error instanceof Error ? error : new Error("Failed to load design inspector"),
          {
            boundary: "higgsfield_design_inspector_import",
          },
        );
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
