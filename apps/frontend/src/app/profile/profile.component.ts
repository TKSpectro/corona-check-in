import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileService } from './profile.service';

@Component({
  selector: 'ccn-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  updateSub!: Subscription;

  id!: string;
  email!: string;
  firstname!: string;
  lastname!: string;
  oldPassword!: string;
  newPassword!: string;
  newPasswordRepeat!: string;

  error!: string;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfileData();
    this.subscription = this.profileService.submitProfileData.subscribe(
      (data) => {
        this.id = data.id;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.email = data.email;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.updateSub.unsubscribe();
  }

  handleUpdate() {
    this.profileService.updateUser(this.id, {
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      newPasswordRepeat: this.newPasswordRepeat,
    });
    this.updateSub = this.profileService.updateProfileData.subscribe((data) => {
      if (data instanceof HttpErrorResponse) {
        this.error = data.error.message;
        return;
      }
      this.id = data.id;
      this.firstname = data.firstname;
      this.lastname = data.lastname;
      this.email = data.email;
      this.firstname = data.firstname;
      this.lastname = data.lastname;
    });
  }

  handleDelete() {
    this.profileService.deleteUser(this.id);
  }

  handleLogout() {
    this.profileService.logout();
  }
}
