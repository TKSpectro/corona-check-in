import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
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
      return this.requestIsAdmin();
    } else {
      return this.isAdmin;
    }
  }

  requestIsAdmin() {
    return this.serverSrv.isAdmin().pipe(
      map((result) => {
        this.isAdmin = result.isAdmin;
        return result.isAdmin;
      })
    );
  }

  reset() {
    this.isAdmin = null;
  }
}
