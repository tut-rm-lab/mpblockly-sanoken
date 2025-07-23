export async function startViteServer(): Promise<string> {
  const { createServer, preview } = await import('vite');
  const server = await (process.env.NODE_ENV === 'development'
    ? (await createServer()).listen()
    : preview());
  const url = server.resolvedUrls?.local[0];
  if (!url) {
    throw new Error('failed to start dev server');
  }
  return url;
}
