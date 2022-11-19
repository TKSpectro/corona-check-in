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

  id!: string;
  email!: string;
  firstname!: string;
  lastname!: string;
  oldPassword!: string;
  newPassword!: string;
  newPasswordRepeat!: string;

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
  }

  handleSubmit() {
    console.log('email', this.email);
  }

  handleDelete() {
    this.profileService.deleteUser(this.id);
  }
}
