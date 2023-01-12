import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Room } from '../../shared/types';
import { RoomsService } from '../rooms.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ccn-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'created',
    'updated',
    'maxParticipants',
    'maxDuration',
    'faculty',
  ];

  roomList!: Room[];
  subscription!: Subscription;
  _meta: any;
  pageEvent: PageEvent = new PageEvent();
  total!: number;
  limit!: number;
  page!: number;
  filter?: string;

  constructor(private roomSrv: RoomsService) {}

  ngOnInit(): void {
    this.subscription = this.roomSrv.roomList$.subscribe((data) => {
      this.roomList = data.data;
      this._meta = data._meta;
    });
  }

  loadRooms() {
    this.roomSrv.getRoomListWithMetaData(this.page, 10, this.filter).subscribe({
      next: (data) => {
        this.roomList = data.data;
        this._meta = data._meta;
      },
      error: (err) => console.error(err),
    });
  }

  applyFilter(event: Event) {
    this.filter = (event.target as HTMLInputElement).value;
    this.loadRooms();
  }

  resetFilter() {
    this.filter = '';
    this.loadRooms();
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.total = e.length;
    this.limit = e.pageSize;
    this.page = e.pageIndex;
    this.loadRooms();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  naviagte(row: string) {
    console.log('id= ', row);
  }
}
