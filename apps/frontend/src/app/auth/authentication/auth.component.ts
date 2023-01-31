import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ccn-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  email!: string;
  firstname!: string;
  lastname!: string;
  password!: string;
  passwordRepeat!: string;
  isSignup = false;
  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSrv.authStatusSubject.subscribe((isSignup) => {
      this.isSignup = isSignup;
    });
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
  }
}
