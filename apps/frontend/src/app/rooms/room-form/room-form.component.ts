import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../auth/admin/admin.service';
import { ServerService } from '../../shared/server.service';
import { FacultyList, Room } from '../../shared/types';
@Component({
  selector: 'ccn-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss'],
})
export class RoomFormComponent implements OnInit, OnDestroy {
  room!: Room;
  subscriptions: Subscription[] = [];
  id = '';
  isUpdate = false;
  facultyList = FacultyList;

  adminService: AdminService;

  constructor(
    private serverService: ServerService,
    adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: { id?: string },
    private dialogRef: DialogRef<RoomFormComponent>,
    private snackBar: MatSnackBar,
    private t: TranslateService
  ) {
    this.adminService = adminService;

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
        this.serverService.getRoom(this.id).subscribe({
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
        this.serverService.updateRoom(this.room).subscribe({
          next: () => {
            this.dialogRef.close();
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
        this.serverService.createRoom(this.room).subscribe({
          next: () => {
            this.dialogRef.close();
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
