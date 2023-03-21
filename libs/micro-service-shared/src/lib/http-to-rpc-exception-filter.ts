import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { QueryFailedError } from 'typeorm';

@Catch()
export class RpcValidationFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return new RpcException(exception.getResponse());
    } else if (exception instanceof QueryFailedError) {
      return new RpcException({
        statusCode: 400,
        message: exception.message,
        error: 'Bad Request',
      });
    } else if (exception instanceof Error) {
      return new RpcException({
        statusCode: 500,
        message: exception.message,
        error: 'Internal Server Error',
      });
    }

    return new RpcException(exception.toString());
  }
}

@Injectable()
export class SneakyErrorInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      switchMap((data) => {
        if (data?.error) {
          return throwError(() => new HttpException(data.error, 500));
        }

        return of(data);
      })
    );
  }
}
