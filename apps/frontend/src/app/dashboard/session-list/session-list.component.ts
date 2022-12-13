import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, switchMap, tap } from 'rxjs';
import { SessionListService } from './session-list.service';

@Component({
  selector: 'ccn-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
})
export class SessionListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'startTime', 'endTime', 'infected'];
  sessionData!: any;
  subscription!: Subscription;
  _meta: any;
  pageEvent: PageEvent = new PageEvent();
  total!: number;
  limit!: number;
  page!: number;
  dataSource = new MatTableDataSource(this.sessionData);
  sessionNameFilter?: string;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.total = e.length;
    this.limit = e.pageSize;
    this.page = e.pageIndex;
    this.loadSessions();
  }
  constructor(private sessionListService: SessionListService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadSessions() {
    console.log('called');
    // TODO: This will be replaced by a service call
    this.sessionListService.getSessions(this.page, 10, this.sessionNameFilter);
    this.subscription = this.sessionListService.submitSessionData
      .pipe(
        tap((data) => {
          this.dataSource = data.sessions;
          this._meta = data._meta;
        }),
        switchMap(async (params) =>
          this.sessionListService.getSessions(
            this.page,
            10,
            this.sessionNameFilter
          )
        )
      )
      .subscribe();
  }

  applyFilter(event: Event) {
    console.log('called filter');
    this.sessionNameFilter = (event.target as HTMLInputElement).value;
    this.loadSessions();
  }
}
