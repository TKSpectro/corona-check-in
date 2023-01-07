import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../shared/server.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private isAdmin: boolean | null = null;

  constructor(private serverSrv: ServerService, private router: Router) {}

  autoAdmin() {
    return this.isAdmin;
  }

  getIsAdmin() {
    if (this.isAdmin === null) {
      this.requestIsAdmin();
    }

    return this.isAdmin;
  }

  requestIsAdmin() {
    // TODO: fix this, login has to happen first before this is called
    setTimeout(() => {
      return this.serverSrv.isAdmin().subscribe({
        next: (result) => {
          this.isAdmin = result.isAdmin;
          return true;
        },
        error: (error) => {
          this.isAdmin = false;
          return false;
        },
      });
    }, 200);
  }

  reset() {
    this.isAdmin = null;
  }
}
