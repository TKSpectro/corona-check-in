import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ConfirmationDialogComponent } from '../libs';
import { TitleService } from '../shared/title.service';
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
    private authService: AuthService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private t: TranslateService,
    private titleService: TitleService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.t.get('PROFILES.PROFILE').subscribe((res: string) => {
        this.titleService.setTitle(res);
      })
    );

    this.subscriptions.push(
      this.profileService.getProfileData().subscribe({
        next: (data) => {
          this.id = data.id as string;
          this.firstname = data.firstname as string;
          this.lastname = data.lastname as string;
          this.email = data.email as string;
          this.firstname = data.firstname as string;
          this.lastname = data.lastname as string;
        },
        error: (error) => {
          this.snackBar.open(
            this.t.instant('PROFILES.LOAD_PROFILE_ERROR') +
              '\n' +
              error.error.message,
            undefined,
            {
              panelClass: 'snackbar-error',
            }
          );
        },
      })
    );
  }

  handleUpdate() {
    this.subscriptions.push(
      this.profileService
        .updateUser(this.id, {
          email: this.email,
          firstname: this.firstname,
          lastname: this.lastname,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          newPasswordRepeat: this.newPasswordRepeat,
        })
        .subscribe({
          next: (data) => {
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
          },
          error: (error) => {
            this.snackBar.open(
              this.t.instant('PROFILES.PROFILE_UPDATE_ERROR') +
                '\n' +
                this.t.instant(error.error.message),
              undefined,
              {
                panelClass: 'snackbar-error',
              }
            );
          },
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
        this.subscriptions.push(
          this.profileService.deleteUser(this.id).subscribe({
            next: () => {
              this.authService.logout();

              this.snackBar.open(
                this.t.instant('PROFILES.PROFILE_DELETE_SUCCESS'),
                undefined,
                {
                  panelClass: 'snackbar-success',
                }
              );

              this.router.navigate(['/']);
            },
            error: (error) => {
              this.snackBar.open(
                this.t.instant('PROFILES.PROFILE_DELETE_ERROR') +
                  '\n' +
                  error.error.message,
                undefined,
                {
                  panelClass: 'snackbar-error',
                }
              );
            },
          })
        );
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
