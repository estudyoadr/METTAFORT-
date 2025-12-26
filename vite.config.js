import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Mapeia tanto API_KEY quanto METTAFORT para process.env.API_KEY usado no app
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || process.env.METTAFORT || '')
  },
  build: {
    outDir: 'dist'
  }
});