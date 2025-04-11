import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/khalti-api': {
        target: 'https://khalti.com/api/v2',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/khalti-api/, ''),
      },
    },
  },
});
