import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../auth/admin/admin.service';
import { User } from '../../auth/user';
import { UsersService } from '../users.service';

@Component({
  selector: 'ccn-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnDestroy {
  subscriptions: Subscription[] = [];

  user!: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialogRef: MatDialogRef<UserFormComponent>,
    private snackBar: MatSnackBar,
    private t: TranslateService,
    private userSrv: UsersService,
    public adminService: AdminService
  ) {
    this.user = data.user;
  }

  saveUser() {
    this.subscriptions.push(
      this.userSrv.updateUser(this.user.id, this.user).subscribe({
        next: () => {
          this.dialogRef.close(this.user);

          this.snackBar.open(
            this.t.instant('USERS.UPDATE_USER_SUCCESS'),
            undefined,
            {
              panelClass: 'snackbar-success',
            }
          );
        },
        error: (error) => {
          this.snackBar.open(
            this.t.instant('USERS.UPDATE_USER_ERROR') +
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

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
