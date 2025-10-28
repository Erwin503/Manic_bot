import https from 'https';
import fs from 'fs';
import { app } from './app.js';
import { config } from './config.js';
import { telegramService } from './services/telegram.service.js';
import { logger } from './logger.js';

const key = fs.readFileSync('key.pem');
const cert = fs.readFileSync('cert.pem');

async function main() {
  const server = https.createServer({ key, cert }, app).listen(8443, async () => {
    const fullUrl = `https://${config.baseUrl || 'YOUR.PUBLIC.IP.ADDR:8443'}/v1/webhook/telegram/${config.secret}`;
    // если в .env WEBHOOK_URL пуст, мы всё равно регистрируем вебхук руками на шаге 4
    logger.info({ port: 8443, fullUrl }, 'HTTPS started');
  });

  process.once('SIGINT', () => server.close(() => process.exit(0)));
  process.once('SIGTERM', () => server.close(() => process.exit(0)));
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
