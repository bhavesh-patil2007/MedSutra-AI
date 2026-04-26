import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss()],
    // FIXED: Only expose keys that are safe for the client.
    // GEMINI_API_KEY must NOT be exposed here — it belongs server-side only.
    // Expose Maps key only if your frontend Maps component needs it directly.
    define: {
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(env.GOOGLE_MAPS_API_KEY ?? ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      hmr: env.DISABLE_HMR !== 'true',
      // FIXED: Proxy /api calls to the Express backend during development
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  };
});