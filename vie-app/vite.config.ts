import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import VueRouter from "vue-router/vite";
import tailwindcss from "@tailwindcss/vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import Fonts from "unplugin-fonts/vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  define: { "process.env": {} },
  plugins: [
    VueRouter(),
    tailwindcss(),
    Vue({
      template: { transformAssetUrls },
    }), // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: "Roboto Mono",
            weights: [400, 700],
          },
          {
            name: "Roboto",
            weights: [100, 300, 400, 500, 700, 900],
            styles: ["normal", "italic"],
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 5173,
  },
});
