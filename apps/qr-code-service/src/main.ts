import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { AppModule } from './app/app.module';

@Catch(HttpException)
export class RpcValidationFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    return new RpcException(exception.getResponse());
  }
}

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
