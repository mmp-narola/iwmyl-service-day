import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // Point this to your main.tsx
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'MOWGame',
      formats: ['iife'], // This format works best for WordPress script tags
      fileName: () => `service_day.bundle.js`,
    },
    rollupOptions: {
      // These are provided by WordPress/CDN, don't bundle them!
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        // Ensures your CSS filename matches what PHP expects
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'service_day.css';
          }
          return assetInfo.name || '';
        },
      },
    },
  },
});
