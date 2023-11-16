import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3002,
  },
  root: resolve(__dirname, 'src'),
  build: {
    outDir: '../dist',
  },
});
