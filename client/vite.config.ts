import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Ensure editorial artworks from artifact directory are copied to public/images/editorial
const BRAIN_DIR = 'C:/Users/tnjos/.gemini/antigravity-ide/brain/a8d942d9-bb09-4696-8bd9-342d85ab5d53';
const EDITORIAL_OUT = path.resolve(process.cwd(), 'public/images/editorial');

try {
  if (!fs.existsSync(EDITORIAL_OUT)) {
    fs.mkdirSync(EDITORIAL_OUT, { recursive: true });
  }
  const mappings: Record<string, string> = {
    'hero.jpg': 'editorial_hero_loft_1792852439857.jpg',
    'roommates.jpg': 'roommates_co_living_1792852483860.jpg',
    'keys.jpg': 'verified_handover_keys_1792852506564.jpg',
    'residence.jpg': 'serene_campus_residence_1792852535461.jpg',
  };

  for (const [targetName, sourceName] of Object.entries(mappings)) {
    const src = path.join(BRAIN_DIR, sourceName);
    const dst = path.join(EDITORIAL_OUT, targetName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
    }
  }
} catch (e) {
  console.warn('Editorial art sync notice:', e);
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:5000';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/socket.io': {
          target: proxyTarget,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    preview: {
      port: 4173,
    },
  };
});
