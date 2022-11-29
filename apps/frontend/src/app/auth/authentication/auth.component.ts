import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ccn-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  email!: string;
  firstname!: string;
  lastname!: string;
  password!: string;
  passwordRepeat!: string;

  isSignup = false;

  constructor(private authSrv: AuthService, private router: Router) {}

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
  }
}
