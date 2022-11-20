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
  password!: string;

  constructor(private authSrv: AuthService, private router: Router) {}

  handleSubmit() {
    this.authSrv.login({ email: this.email, password: this.password });
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
