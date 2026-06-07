import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

const locatorBabelJsxWindows = path.resolve(
  import.meta.dirname,
  "vite-plugins/locator-babel-jsx-windows.cjs",
);

async function loadReplitDevPlugins(): Promise<Plugin[]> {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.REPL_ID === undefined
  ) {
    return [];
  }

  const [cartographerMod, devBannerMod] = await Promise.all([
    import("@replit/vite-plugin-cartographer"),
    import("@replit/vite-plugin-dev-banner"),
  ]);

  return [cartographerMod.cartographer(), devBannerMod.devBanner()];
}

const replitDevPlugins = await loadReplitDevPlugins();

export default defineConfig(({ mode }) => ({
  base: "/",
  plugins: [
    react({
      babel: {
        plugins:
          mode === "development"
            ? [
                [
                  locatorBabelJsxWindows,
                  {
                    env: "development",
                  },
                ],
              ]
            : [],
      },
    }),
    ...(process.env.NODE_ENV !== "production" ? [runtimeErrorOverlay()] : []),
    tailwindcss(),
    metaImagesPlugin(),
    ...replitDevPlugins,
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2020",
    cssCodeSplit: true,
    minify: "esbuild",
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    // LAN: client must open WS on the same port the browser uses (see server.hmr in Vite docs).
    hmr: {
      overlay: true,
      clientPort: 5173,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      logOverride: { "this-is-undefined-in-esbuild": "silent" },
    },
  },
}));