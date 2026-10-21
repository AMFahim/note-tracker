import { INestApplicationContext, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

export async function runScript(
  name: string,
  task: (app: INestApplicationContext, logger: Logger) => Promise<void>,
) {
  const logger = new Logger(name);
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  try {
    await task(app, logger);
  } catch (error) {
    logger.error(error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}
