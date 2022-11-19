import { Injectable } from '@angular/core';
import { ServerService } from '../shared/server.service';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = '';

  getToken(): string {
    return this.token;
  }

  login(user: User) {
    console.log('user', user);
    this.serverSrv.login(user).subscribe({
      next: (result) => {
        this.token = result.token;
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

  constructor(private serverSrv: ServerService) {}
}
