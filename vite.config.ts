import { defineConfig } from 'vite';

const name = 'awesomeStyler';

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
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
