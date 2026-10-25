import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // `npm run server` runs the API on 8787 while `npm run dev` serves the site
    proxy: { '/api': 'http://localhost:8787' },
  },
});
