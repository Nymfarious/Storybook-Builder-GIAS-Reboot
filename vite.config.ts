import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Flattens the build into a single index.html for Google Apps Script compatibility
    viteSingleFile() 
  ],
  // Ensures assets use relative paths './' instead of absolute '/'
  // Critical for GitHub Pages subdirectories and GIAS sandboxed iframes
  base: './', 
  build: {
    // Optimization: Don't minify too aggressively if we need to debug in GIAS
    minify: 'esbuild',
  }
});