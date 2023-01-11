import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AdminService } from '../../auth/admin/admin.service';
import { SessionListService } from './session-list.service';

@Component({
  selector: 'ccn-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
})
export class SessionListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['startTime', 'endTime', 'infected', 'actions'];
  sessionData!: any;
  subscription!: Subscription;
  _meta: any;
  pageEvent: PageEvent = new PageEvent();
  total!: number;
  limit!: number;
  page!: number;
  dataSource = new MatTableDataSource(this.sessionData);
  sessionNameFilter?: string;
  infected?: boolean;
  sessionBegin?: Date;
  sessionEnd?: Date;

  adminService: AdminService;

  // Datepicker
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.total = e.length;
    this.limit = e.pageSize;
    this.page = e.pageIndex;
    this.loadSessions();
  }

  constructor(
    private sessionListService: SessionListService,
    adminService: AdminService
  ) {
    this.adminService = adminService;
  }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions() {
    // TODO: This will be replaced by a service call
    this.subscription = this.sessionListService
      .getSessions(
        this.page,
        10,
        this.infected,
        this.sessionBegin?.toDateString(),
        this.sessionEnd?.toDateString(),
        this.sessionNameFilter
      )
      .subscribe(
        (data) => {
          this.sessionData = data.data;
          this._meta = data._meta;
          this.dataSource = new MatTableDataSource(this.sessionData);
        },
        (err) => console.error(err)
      );
  }

  applyFilter(event: Event) {
    this.sessionNameFilter = (event.target as HTMLInputElement).value;
    this.loadSessions();
  }

  toggleInfectionFilter() {
    this.infected = !this.infected;
    this.loadSessions();
  }

  sessionInputChanged() {
    this.loadSessions();
  }

  resetFilter() {
    this.infected = undefined;
    this.sessionBegin = undefined;
    this.sessionEnd = undefined;
    this.range.value.start = undefined;
    this.range.value.end = undefined;
    this.loadSessions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
