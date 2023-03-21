import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { TitleService } from '../../shared/title.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ccn-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  email!: string;
  firstname!: string;
  lastname!: string;
  password!: string;
  passwordRepeat!: string;
  isSignup = false;
  constructor(
    public t: TranslateService,
    private snackBar: MatSnackBar,
    private authSrv: AuthService,
    private router: Router,
    private titleService: TitleService
  ) {}

  ngOnInit() {
    this.generateTitle();

    this.subscriptions.push(
      this.authSrv.authStatusSubject.subscribe((isSignup) => {
        this.isSignup = isSignup;
      })
    );

    this.subscriptions.push(
      this.authSrv.loginErrorSubject.subscribe(async (error) => {
        this.snackBar.open(
          (await firstValueFrom(this.t.get('AUTH.LOGIN_ERROR'))) +
            '\n' +
            (await firstValueFrom(this.t.get(error?.error?.message))),
          undefined,
          {
            panelClass: 'snackbar-error',
          }
        );
      })
    );

    this.subscriptions.push(
      this.authSrv.signupErrorSubject.subscribe(async (error) => {
        this.snackBar.open(
          (await firstValueFrom(this.t.get('AUTH.SIGNUP_ERROR'))) +
            '\n' +
            (await firstValueFrom(this.t.get(error?.error?.message))),
          undefined,
          {
            panelClass: 'snackbar-error',
          }
        );
      })
    );
  }

  generateTitle() {
    if (this.isSignup === true) {
      this.subscriptions.push(
        this.t.get('REGISTER').subscribe((res: string) => {
          this.titleService.setTitle(res);
        })
      );
    } else {
      this.subscriptions.push(
        this.t.get('LOGIN').subscribe((res: string) => {
          this.titleService.setTitle(res);
        })
      );
    }
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
      this.authSrv.login({ email: this.email, password: this.password });
    }
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  clickSwitch() {
    this.isSignup = !this.isSignup;
    this.authSrv.authStatusSubject.next(this.isSignup);
    this.generateTitle();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
