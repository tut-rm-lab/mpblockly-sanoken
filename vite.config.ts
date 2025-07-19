import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vite';

export default {
  base: './',
  build: {
    outDir: 'dist-vite',
  },
  plugins: [react()],
} satisfies UserConfig;
