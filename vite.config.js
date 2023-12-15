import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  server: {
    port: 3002,
  },
  base: '/github-page/',
  build: {
    outDir: '../docs',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  // build: {
  //   outDir: '../dist',
  // },
  publicDir: resolve(__dirname, 'public'),
});
