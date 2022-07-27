import { defineConfig } from "vite";
import logseqDevPlugin from "vite-plugin-logseq";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [logseqDevPlugin()],
  // Makes HMR available for development
  build: {
    sourcemap: true,
    target: "esnext",
    minify: "esbuild",
  },
});
