import { MediaMatcher } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../libs';
import { Meta, User } from '../../shared/types';
import { UserFormComponent } from '../user-form/user-form.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'ccn-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;
  isDesktop!: boolean;

  displayedColumns: string[] = [
    'email',
    'firstname',
    'lastname',
    'role',
    'actions',
  ];

  userList!: User[];
  _meta?: Meta;
  pageEvent: PageEvent = new PageEvent();
  total!: number;
  limit!: number;
  page!: number;
  search = new FormControl('');
  timeout?: any;

  formDialogRef?: MatDialogRef<UserFormComponent>;

  constructor(
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    private t: TranslateService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private userSrv: UsersService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1150px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener(
      'change',
      (event) => (this.isDesktop = !event.matches)
    );
  }

  ngOnInit(): void {
    this.loadUsers();

    this.subscriptions.push(
      this.search.valueChanges.subscribe(() => {
        // If the user is still typing, clear the timeout
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        // Only if the user has stopped typing for 400ms, load the users
        this.timeout = setTimeout(() => {
          this.loadUsers();
        }, 400);
      })
    );
  }

  loadUsers() {
    this.subscriptions.push(
      this.userSrv.getUsers(this.page, 10, this.search.value || '').subscribe({
        next: (data) => {
          this.userList = data.data;
          this._meta = data._meta;
        },
        error: (error) => {
          this.snackBar.open(
            this.t.instant('USERS.LOAD_USER_LIST_ERROR') +
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

  resetFilter() {
    this.search.setValue('');
    this.loadUsers();
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.total = e.length;
    this.limit = e.pageSize;
    this.page = e.pageIndex;
    this.loadUsers();
  }

  openUpdateDialog(event: Event, user?: User) {
    event.stopPropagation();
    this.formDialogRef = this.dialog.open(UserFormComponent, {
      // Spread the user object to get rid of the reference
      data: { user: { ...user } },
      panelClass: 'custom-dialog',
    });

    this.subscriptions.push(
      this.formDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (this._meta) {
            this.page = 0;
          }
          this.loadUsers();
        }
      })
    );
  }

  openDeleteDialog(event: Event, id: string) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'USERS.DELETE_USER',
        description: 'USERS.DELETE_USER_WARNING',
      },
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.subscriptions.push(
            this.userSrv.deleteUser(id).subscribe((data) => {
              if (data instanceof HttpErrorResponse) {
                this.snackBar.open(
                  this.t.instant('USERS.DELETE_USER_ERROR'),
                  undefined,
                  {
                    panelClass: 'snackbar-error',
                  }
                );
                return;
              }

              this.loadUsers();

              this.snackBar.open(
                this.t.instant('USERS.DELETE_USER_SUCCESS'),
                undefined,
                {
                  panelClass: 'snackbar-success',
                }
              );
            })
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
