import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServerService } from '../shared/server.service';
import { AdminService } from './admin/admin.service';
import { User, UserSignup } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private token: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private serverSrv: ServerService,
    private router: Router,
    public adminService: AdminService
  ) {}

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

          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error(error);
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

          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error(error);
        },
      })
    );
  }

  logout() {
    this.token = '';
    localStorage.removeItem('ccn_token');

    this.adminService.reset();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
