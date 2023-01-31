import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ServerService } from '../shared/server.service';
import { AdminService } from './admin/admin.service';
import { User, UserSignup } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private token: string | null = null;
  private loginSubject = new Subject<boolean>();
  private subscriptions: Subscription[] = [];
  private isLoggedIn = false;
  authStatusSubject = new Subject<boolean>();

  constructor(
    private serverSrv: ServerService,
    private router: Router,
    public adminService: AdminService
  ) {}

  public get isLoggedIn$() {
    return this.loginSubject.asObservable();
  }

  autoLogin() {
    return this.token;
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('ccn_token');
    }

    return this.token;
  }

  login(user: User) {
    this.subscriptions.push(
      this.serverSrv.login(user).subscribe({
        next: (result) => {
          this.token = result.token;
          localStorage.setItem('ccn_token', this.token);
          this.adminService.autoAdmin();
          this.isLoggedIn = true;
          this.loginSubject.next(this.isLoggedIn);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          // TODO: This can only be done in the component, as the translation service is not available here
          // this.snackBar.open(
          //   this.t.instant('AUTH.LOGIN_ERROR' + '\n' + error.error.message),
          //   undefined,
          //   {
          //     panelClass: 'snackbar-error',
          //   }
          // );
        },
      })
    );
  }

  signup(user: UserSignup) {
    this.subscriptions.push(
      this.serverSrv.signup(user).subscribe({
        next: (result) => {
          this.token = result.token;
          localStorage.setItem('ccn_token', this.token);
          this.adminService.autoAdmin();
          this.loginSubject.next(this.isLoggedIn);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          // TODO: This can only be done in the component, as the translation service is not available here
          // this.snackBar.open(
          //   this.t.instant('AUTH.SIGNUP_ERROR' + '\n' + error.error.message),
          //   undefined,
          //   {
          //     panelClass: 'snackbar-error',
          //   }
          // );
        },
      })
    );
  }

  logout() {
    this.token = '';
    localStorage.removeItem('ccn_token');
    this.isLoggedIn = false;
    this.loginSubject.next(this.isLoggedIn);
    this.adminService.reset();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
