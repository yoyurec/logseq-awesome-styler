import { build, defineConfig } from 'vite';

const name = 'awesomeStyler';

// build

build({
  configFile: false,
  build: {
    emptyOutDir: true,
    sourcemap: true,
    target: 'esnext',
    minify: 'esbuild',
    lib: {
      formats: ['cjs'],
      entry: `./src/${name}Ext.ts`,
    },
    rollupOptions: {
      output: {
        strict: false,
        entryFileNames: `assets/${name}Ext.js`,
        assetFileNames: `assets/${name}Ext.[ext]`,
      }
    }
  }
});

export default defineConfig({
  base: '',
  build: {
    emptyOutDir: false,
    sourcemap: true,
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        entryFileNames: `assets/${name}Int.js`,
        chunkFileNames: `assets/chunks/${name}Int.js`,
        assetFileNames: `assets/${name}Int.[ext]`,
      }
    }
  }
});
