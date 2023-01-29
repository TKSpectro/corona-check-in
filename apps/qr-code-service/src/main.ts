import { RpcValidationFilter } from '@corona-check-in/micro-service-shared';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: environment.redis,
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
