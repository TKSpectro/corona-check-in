import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../auth/admin/admin.service';
import { FacultyList, Room } from '../../shared/types';
import { RoomsService } from '../rooms.service';
@Component({
  selector: 'ccn-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss'],
})
export class RoomFormComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  facultyList = FacultyList;

  room!: Room;
  id = '';
  isUpdate = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id?: string },
    private dialogRef: MatDialogRef<RoomFormComponent>,
    private snackBar: MatSnackBar,
    private t: TranslateService,
    private roomSrv: RoomsService,
    public adminService: AdminService
  ) {
    if (this.data?.id) {
      this.isUpdate = true;
    } else {
      this.room = {
        id: '',
        name: '',
        createdDate: '',
        updatedDate: '',
        faculty: '',
        maxDuration: 120,
        maxParticipants: 30,
        createdQrCode: new Date(),
        qrCode: null,
      };
    }
  }

  ngOnInit(): void {
    if (this.isUpdate && this.data.id) {
      this.id = this.data.id;
      this.subscriptions.push(
        this.roomSrv.getRoomDetails(this.id).subscribe({
          next: (data) => {
            this.room = data;
          },
          error: (error) => {
            console.log(error.error.message);
          },
        })
      );
    }
  }

  saveRoom() {
    if (this.isUpdate) {
      this.subscriptions.push(
        this.roomSrv.updateRoom(this.room).subscribe({
          next: () => {
            this.dialogRef.close(this.room);

            this.snackBar.open(
              this.t.instant('ROOMS.UPDATE_ROOM_SUCCESS'),
              undefined,
              {
                panelClass: 'snackbar-success',
              }
            );
          },
          error: (error) => {
            this.snackBar.open(
              this.t.instant('ROOMS.UPDATE_ROOM_ERROR') +
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
    } else {
      this.subscriptions.push(
        this.roomSrv.createRoom(this.room).subscribe({
          next: (room) => {
            this.dialogRef.close(this.room);

            this.snackBar.open(
              this.t.instant('ROOMS.CREATE_ROOM_SUCCESS'),
              undefined,
              {
                panelClass: 'snackbar-success',
              }
            );
          },
          error: (error) => {
            this.snackBar.open(
              this.t.instant('ROOMS.CREATE_ROOM_ERROR') +
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
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
