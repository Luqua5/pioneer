import { defineConfig } from 'vite';
import string from 'vite-plugin-string';

export default defineConfig({
  assetsInclude: ['**/*.glb'],

  base: './',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,  
  },

  server: {
    host: true,
    port: 3000, 
  },

  plugins: [
    string({
        include: '**/*.obj',
    })
  ],

  resolve: {
  }
});
