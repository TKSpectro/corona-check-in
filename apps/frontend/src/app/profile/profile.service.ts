import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ServerService } from '../shared/server.service';
import { UpdateUser, User } from '../shared/types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  profileData!: User;
  submitProfileData = new Subject<User>();
  updateProfileData = new Subject<User>();
  deleteUserData = new Subject<User>();

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
        this.submitProfileData.error(error);
      },
    });

    return this.profileData;
  }

  updateUser(id: string, data: UpdateUser) {
    this.serverSrv.updateUser(id, data).subscribe({
      next: (result) => {
        this.profileData = result;
        this.updateProfileData.next(this.profileData);
      },
      error: (error) => {
        this.updateProfileData.next(error);
      },
    });

    return this.profileData;
  }

  deleteUser(id: string) {
    this.serverSrv.deleteUser(id).subscribe({
      next: (res) => {
        this.authService.logout();

        this.deleteUserData.next(res);
      },
      error: (error) => {
        this.deleteUserData.next(error);
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
