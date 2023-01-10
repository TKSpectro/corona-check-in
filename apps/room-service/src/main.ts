/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { RpcValidationFilter } from '@corona-check-in/micro-service-shared';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,

        // optional stuff
        retryAttempts: 3,
        retryDelay: 500,
      },
    }
  );

  // Have to use a custom filter to convert HttpExceptions to RpcExceptions
  app.useGlobalFilters(new RpcValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, enableDebugMessages: true })
  );

  await app.listen();
}

bootstrap();
