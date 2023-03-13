import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ServerService } from '../shared/server.service';
import { AdminService } from './admin/admin.service';
import { UserLogin, UserSignup } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private token: string | null = null;
  private loginSubject = new Subject<boolean>();
  private subscriptions: Subscription[] = [];
  private isLoggedIn = false;
  loginErrorSubject = new Subject<any>();
  signupErrorSubject = new Subject<any>();
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

  login(user: UserLogin) {
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
          this.loginErrorSubject.next(error);
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
          this.signupErrorSubject.next(error);
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
