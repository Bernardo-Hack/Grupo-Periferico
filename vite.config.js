import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, '.'),        
  base: '/',                         
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') }
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } }
  }
});