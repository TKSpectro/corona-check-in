import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Meta, User } from '../../shared/types';
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
    'name',
    'updated',
    'maxParticipants',
    'maxDuration',
    'faculty',
  ];

  userList!: User[];
  _meta?: Meta;
  pageEvent: PageEvent = new PageEvent();
  total!: number;
  limit!: number;
  page!: number;
  search = new FormControl('');

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

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
