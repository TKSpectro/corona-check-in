import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authSrv: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authSrv.getToken();
    if (token === '') {
      return next.handle(request);
    }
    const authReq = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
    return next.handle(authReq);
  }
}
