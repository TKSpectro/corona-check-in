import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  isAdmin: boolean | null = null;

  constructor(public jwtHelper: JwtHelperService) {}

  autoAdmin() {
    const decodedToken = this.jwtHelper.decodeToken(
      localStorage.getItem('ccn_token') || ''
    );

    this.isAdmin = decodedToken?.role === 'admin';

    return this.isAdmin;
  }

  getIsAdmin() {
    if (this.isAdmin === null) {
      return this.autoAdmin();
    } else {
      return this.isAdmin;
    }
  }

  reset() {
    this.isAdmin = null;
  }
}
