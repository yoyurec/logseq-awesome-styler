import { defineConfig } from 'vite';
import logseqDevPlugin from 'vite-plugin-logseq';

const name = 'awesomeStyler';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [logseqDevPlugin()],
  // Makes HMR available for development
  build: {
    sourcemap: true,
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        entryFileNames: `assets/${name}.js`,
        chunkFileNames: `assets/chunks/${name}.js`,
        assetFileNames: `assets/${name}.[ext]`,
      }
    }
  }
});
