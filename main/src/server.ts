import { resolve } from 'node:path';
import { app } from 'electron';

export async function startViteServer(): Promise<string> {
  const { createServer, preview } = await import('vite');

  const config = {
    root: resolve(app.getAppPath(), './renderer'),
  };
  const server = await (process.env.NODE_ENV === 'development'
    ? (await createServer(config)).listen()
    : preview(config));
  const url = server.resolvedUrls?.local[0];
  if (!url) {
    throw new Error('failed to start dev server');
  }

  return url;
}
