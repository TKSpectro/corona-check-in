import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'ccn-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user: User = {
      email: 'user@turbomeet.xyz',
      password: 'password',
    };
    this.authSrv.login(user);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
