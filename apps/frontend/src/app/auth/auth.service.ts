import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../shared/server.service';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;

  constructor(private serverSrv: ServerService, private router: Router) {}

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }

    return this.token;
  }

  login(user: User) {
    this.serverSrv.login(user).subscribe({
      next: (result) => {
        this.token = result.token;
        localStorage.setItem('token', this.token);

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  logout() {
    this.token = '';
    localStorage.removeItem('token');
  }
}
