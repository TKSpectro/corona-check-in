import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.authService.logout();
          this.router.navigate(['/auth']);
        }
        const error = err.error.message || err.statusText;
        this.snackBar.open(error, undefined, {
          panelClass: 'snackbar-error',
        });

        // TODO: we should decide if we want to throw the error or not
        // return throwError(error);
        return next.handle(request);
      })
    );
  }
}
