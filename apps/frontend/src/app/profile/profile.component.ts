import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileService } from './profile.service';

interface DialogData {
  id: string;
}

@Component({
  selector: 'ccn-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  updateSub!: Subscription;
  deleteSub!: Subscription;

  id!: string;
  email!: string;
  firstname!: string;
  lastname!: string;
  oldPassword!: string;
  newPassword!: string;
  newPasswordRepeat!: string;

  error!: string;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.profileService.getProfileData();
    this.subscription = this.profileService.submitProfileData.subscribe(
      (data) => {
        this.id = data.id as string;
        this.firstname = data.firstname as string;
        this.lastname = data.lastname as string;
        this.email = data.email as string;
        this.firstname = data.firstname as string;
        this.lastname = data.lastname as string;
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
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

      this.id = data.id as string;
      this.firstname = data.firstname as string;
      this.lastname = data.lastname as string;
      this.email = data.email as string;
      this.firstname = data.firstname as string;
      this.lastname = data.lastname as string;

      this.snackBar.open('Profile was successfully updated', undefined, {
        panelClass: 'snackbar-success',
      });
    });
  }

  handleDelete() {
    const dialogRef = this.dialog.open(ProfileDeleteDialogComponent, {
      data: { id: this.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.profileService.deleteUser(this.id);
        this.deleteSub = this.profileService.deleteUserData.subscribe(
          (data) => {
            if (data instanceof HttpErrorResponse) {
              this.snackBar.open('Could not delete the profile', undefined, {
                panelClass: 'snackbar-error',
              });
              return;
            }

            this.profileService.logout();

            this.snackBar.open('Profile was successfully deleted', undefined, {
              panelClass: 'snackbar-success',
            });

            this.router.navigate(['/']);
          }
        );
      }
    });
  }

  handleLogout() {
    this.profileService.logout();
    this.router.navigate(['/']);
  }
}

@Component({
  selector: 'ccn-profile-delete-dialog',
  templateUrl: 'profile-delete-dialog.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ProfileDeleteDialogComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
