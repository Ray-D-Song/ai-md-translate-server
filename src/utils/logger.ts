import pino from 'pino';
import path from 'path';

const logger = pino({
  transport: {
    target: 'pino/file',
    options: {
      destination: path.join(process.cwd(), 'server.log'),
      mkdir: true
    }
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`
});

export default logger;
