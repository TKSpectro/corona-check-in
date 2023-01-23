import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Meta, Room } from '../../shared/types';
import { RoomsService } from '../rooms.service';

@Component({
  selector: 'ccn-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'name',
    'updated',
    'maxParticipants',
    'maxDuration',
    'faculty',
  ];

  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;
  isDesktop!: boolean;

  roomList!: Room[];
  subscription!: Subscription;
  _meta?: Meta;
  pageEvent: PageEvent = new PageEvent();
  total!: number;
  limit!: number;
  page!: number;
  filterName?: string;
  filterFaculty = new FormControl('');

  facultyList = ['', 'AI', 'SA'];

  constructor(
    private roomSrv: RoomsService,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1150px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener(
      'change',
      (event) => (this.isDesktop = !event.matches)
    );
  }

  ngOnInit(): void {
    this.isDesktop = !this.mobileQuery.matches;
    this.subscription = this.roomSrv.getRoomList().subscribe((data) => {
      this.roomList = data.data;
      this._meta = data._meta;
    });
  }

  loadRooms() {
    this.roomSrv
      .getRoomList(
        this.page,
        10,
        this.filterName,
        this.filterFaculty.value || ''
      )
      .subscribe({
        next: (data) => {
          this.roomList = data.data;
          this._meta = data._meta;
        },
        error: (err) => console.error(err),
      });
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

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.subscription.unsubscribe();
  }
}
