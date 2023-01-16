import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, Subscription } from 'rxjs';
import { AdminService } from '../admin/admin.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ccn-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnDestroy {
  email!: string;
  firstname!: string;
  lastname!: string;
  password!: string;
  passwordRepeat!: string;

  isSignup = false;

  subscription!: Subscription;

  isLoggedIn = false;

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private adminSrv: AdminService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleSubmit() {
    if (this.isSignup) {
      this.authSrv.signup({
        email: this.email,
        firstname: this.firstname,
        lastname: this.lastname,
        password: this.password,
        passwordRepeat: this.passwordRepeat,
      });
    } else {
      this.subscription = this.authSrv
        .login({ email: this.email, password: this.password })
        .pipe(
          concatMap((result) => {
            this.isLoggedIn = !!result?.token;

            // TODO: Open snackbar with message login data incorrect

            return this.adminSrv.requestIsAdmin();
          })
        )
        .subscribe({
          next: () => {
            if (this.isLoggedIn) {
              this.router.navigate(['/dashboard']);
            }
          },
          error: () => {
            if (this.isLoggedIn) {
              this.router.navigate(['/dashboard']);
            }
          },
        });
    }
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  clickSwitch() {
    this.isSignup = !this.isSignup;
  }
}
