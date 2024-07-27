import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure this is set to root for deployment
  build: {
    outDir: 'dist', // Output directory for the build
    assetsDir: 'assets', // Directory for static assets within the outDir
    rollupOptions: {
      input: {
        main: './index.html', // Main entry point for your application
      },
    },
    minify: true, // Enable minification
    target: 'es2015', // Target JavaScript version
    sourcemap: true, // Generate source maps
  },
});