import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../libs';
import { ProfileService } from './profile.service';

@Component({
  selector: 'ccn-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

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
    private dialog: MatDialog,
    private t: TranslateService
  ) {}

  ngOnInit(): void {
    this.profileService.getProfileData();
    this.subscriptions.push(
      this.profileService.submitProfileData.subscribe(
        (data) => {
          this.id = data.id as string;
          this.firstname = data.firstname as string;
          this.lastname = data.lastname as string;
          this.email = data.email as string;
          this.firstname = data.firstname as string;
          this.lastname = data.lastname as string;
        },
        (error) => {
          this.snackBar.open(
            this.t.instant(
              'PROFILES.LOAD_PROFILE_ERROR' + '\n' + error.error.message
            ),
            undefined,
            {
              panelClass: 'snackbar-error',
            }
          );
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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
    this.subscriptions.push(
      this.profileService.updateProfileData.subscribe((data) => {
        if (data instanceof HttpErrorResponse) {
          this.snackBar.open(this.t.instant(data?.error?.message), undefined, {
            panelClass: 'snackbar-error',
          });

          return;
        }

        this.id = data.id as string;
        this.firstname = data.firstname as string;
        this.lastname = data.lastname as string;
        this.email = data.email as string;
        this.firstname = data.firstname as string;
        this.lastname = data.lastname as string;

        this.snackBar.open(
          this.t.instant('PROFILES.PROFILE_UPDATE_SUCCESS'),
          undefined,
          {
            panelClass: 'snackbar-success',
          }
        );
      })
    );
  }

  handleDelete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'PROFILES.DELETE_USER',
        description: 'PROFILES.DELETE_USER_WARNING',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.profileService.deleteUser(this.id);
        this.subscriptions.push(
          this.profileService.deleteUserData.subscribe((data) => {
            if (data instanceof HttpErrorResponse) {
              this.snackBar.open(
                this.t.instant('PROFILES.PROFILE_DELETE_ERROR'),
                undefined,
                {
                  panelClass: 'snackbar-error',
                }
              );
              return;
            }

            this.profileService.logout();

            this.snackBar.open(
              this.t.instant('PROFILES.PROFILE_DELETE_SUCCESS'),
              undefined,
              {
                panelClass: 'snackbar-success',
              }
            );

            this.router.navigate(['/']);
          })
        );
      }
    });
  }
}
