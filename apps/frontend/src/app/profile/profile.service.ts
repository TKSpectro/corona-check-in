import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ServerService } from '../shared/server.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  profileData!: any;
  submitProfileData = new Subject<any>();

  constructor(
    private serverSrv: ServerService,
    private authService: AuthService,
    private router: Router
  ) {}

  getProfileData() {
    this.serverSrv.me().subscribe({
      next: (result) => {
        this.profileData = result;
        this.submitProfileData.next(this.profileData);
      },
      error: (error) => {
        console.error(error);
      },
    });

    return this.profileData;
  }

  deleteUser(id: string) {
    this.serverSrv.deleteUser(id).subscribe({
      next: (result) => {
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
      },
    });

    return this.profileData;
  }
}
