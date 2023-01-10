import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../shared/server.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  isAdmin: boolean | null = null;

  constructor(private serverSrv: ServerService, private router: Router) {}

  autoAdmin() {
    return this.isAdmin;
  }

  getIsAdmin() {
    if (this.isAdmin === null) {
      this.requestIsAdmin();
      return this.isAdmin;
    } else {
      return this.isAdmin;
    }
  }

  requestIsAdmin() {
    this.serverSrv.isAdmin().subscribe({
      next: (result) => {
        this.isAdmin = result.isAdmin;
      },
      error: () => {
        this.isAdmin = false;
      },
    });
  }

  reset() {
    this.isAdmin = null;
  }
}
