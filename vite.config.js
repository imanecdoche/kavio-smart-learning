import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/v1': {
        target: 'https://sgp.cloud.appwrite.io',
        changeOrigin: true,
        secure: true,
        headers: {
          origin: 'http://localhost',
        },
      },
    },
  },
});
