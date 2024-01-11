import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  server: {
    port: 3002,
  },
  build: {
    outDir: '../dist',
  },
  publicDir: resolve(__dirname, 'public'),
});
