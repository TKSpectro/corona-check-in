import { MediaMatcher } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../auth/admin/admin.service';
import { ConfirmationDialogComponent } from '../../libs';
import { FacultyList, Meta, Room } from '../../shared/types';
import { RoomFormComponent } from '../room-form/room-form.component';
import { RoomsService } from '../rooms.service';

@Component({
  selector: 'ccn-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;
  isDesktop!: boolean;

  facultyList = FacultyList;
  displayedColumns: string[] = [
    'name',
    'maxParticipants',
    'maxDuration',
    'faculty',
  ];

  roomList!: Room[];
  roomListEmpty = false;
  _meta?: Meta;
  pageEvent: PageEvent = new PageEvent();
  total!: number;
  limit!: number;
  page!: number;
  filterName = '';
  filterFaculty = new FormControl('');

  formDialogRef?: MatDialogRef<RoomFormComponent>;

  constructor(
    private t: TranslateService,
    private snackBar: MatSnackBar,
    private roomSrv: RoomsService,
    public adminSrv: AdminService,
    media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    if (this.adminSrv.isAdmin) {
      this.displayedColumns.push('actions');
    }

    this.mobileQuery = media.matchMedia('(max-width: 1150px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', (event) => {
      this.isDesktop = !event.matches;

      if (this.isDesktop) {
        this.displayedColumns.splice(1, 0, 'updated');
      } else {
        const index = this.displayedColumns.indexOf('updated');
        this.displayedColumns.splice(index, 1);
      }
      this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    });
  }

  ngOnInit(): void {
    if (!this.mobileQuery.matches) {
      this.displayedColumns.splice(1, 0, 'updated');
    }
    this.roomSrv.roomSubject.subscribe({
      next: (data) => {
        if (data) {
          data ? this.loadRooms(true) : '';
        }
      },
    });
    this.isDesktop = !this.mobileQuery.matches;
    this.subscriptions.push(
      this.roomSrv.getRoomList().subscribe((data) => {
        this.roomList = data.data;
        this._meta = data._meta;

        if (this.roomList.length > 0) {
          this.roomListEmpty = false;
        } else {
          this.roomListEmpty = true;
        }
      })
    );
  }

  loadRooms(force = false) {
    this.subscriptions.push(
      this.roomSrv
        .getRoomList(
          this.page,
          10,
          this.filterName,
          this.filterFaculty.value || '',
          undefined,
          force
        )
        .subscribe({
          next: (data) => {
            this.roomList = [...data.data];
            this._meta = data._meta;

            if (this.roomList.length > 0) {
              this.roomListEmpty = false;
            } else {
              this.roomListEmpty = true;
            }
          },
          error: (error) => {
            this.snackBar.open(
              this.t.instant('ROOMS.LOAD_ROOM_LIST_ERROR') +
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

  setFilterName(event: Event) {
    this.filterName = (event.target as HTMLInputElement).value;
    this.loadRooms();
  }

  resetFilter() {
    this.filterName = '';
    this.filterFaculty.setValue('');
    this.loadRooms();
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.total = e.length;
    this.limit = e.pageSize;
    this.page = e.pageIndex;
    this.loadRooms();
  }

  openFormDialog(event: Event, id?: string) {
    event.stopPropagation();
    this.formDialogRef = this.dialog.open(RoomFormComponent, {
      data: { id: id },
      panelClass: 'custom-dialog',
    });

    this.subscriptions.push(
      this.formDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (this._meta) {
            this.page = 0;
          }
          this.loadRooms(true);
        }
      })
    );
  }

  openDeleteDialog(event: Event, id: string) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'ROOMS.DELETE_ROOM',
        description: 'ROOMS.DELETE_ROOM_WARNING',
      },
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.subscriptions.push(
            this.roomSrv.deleteRoom(id).subscribe((data) => {
              if (data instanceof HttpErrorResponse) {
                this.snackBar.open(
                  this.t.instant('ROOMS.DELETE_ROOM_ERROR'),
                  undefined,
                  {
                    panelClass: 'snackbar-error',
                  }
                );
                return;
              }

              this.loadRooms(true);

              this.snackBar.open(
                this.t.instant('ROOMS.DELETE_ROOM_SUCCESS'),
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
