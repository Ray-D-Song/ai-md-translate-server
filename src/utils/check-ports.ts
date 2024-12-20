export async function findAvailablePort(startPort: number): Promise<number> {
  for (let port = startPort; port < startPort + 10000; port += 1000) {
    try {
      const server = Bun.serve({
        port,
        fetch: () => new Response('test')
      });
      
      const address = server.port;
      server.stop();
      
      return address;
    } catch (err) {
      continue;
    }
  }
  throw new Error('No available port found');
}
