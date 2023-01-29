import { MediaMatcher } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
export class RoomListComponent implements OnInit, OnDestroy, AfterViewInit {
  subscriptions: Subscription[] = [];
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;
  isDesktop!: boolean;

  facultyList = FacultyList;
  displayedColumns: string[] = [
    'name',
    'updated',
    'maxParticipants',
    'maxDuration',
    'faculty',
  ];

  roomList!: Room[];
  _meta?: Meta;
  pageEvent: PageEvent = new PageEvent();
  total!: number;
  limit!: number;
  page!: number;
  filterName?: string;
  filterFaculty = new FormControl('');

  formDialogRef?: MatDialogRef<RoomFormComponent>;

  constructor(
    private roomSrv: RoomsService,
    public adminSrv: AdminService,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private t: TranslateService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1150px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener(
      'change',
      (event) => (this.isDesktop = !event.matches)
    );

    if (this.adminSrv.isAdmin) {
      this.displayedColumns.push('actions');
    }
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
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
            console.log('loadRoom=', data);
            this.roomList = [...data.data];
            this._meta = data._meta;
          },
          error: (err) => console.error(err),
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
