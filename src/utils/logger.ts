import pino from 'pino';
import path from 'path';

const logger = pino({
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          destination: path.join(process.cwd(), 'server.log'),
          mkdir: true,
          translateTime: 'SYS:standard'
        }
      },
      {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      }
    ]
  }
});

export default logger;
