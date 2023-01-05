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
  infected?: boolean;

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

  loadSessions() {
    // TODO: This will be replaced by a service call
    console.log(this.infected);
    this.subscription = this.sessionListService
      .getSessions(this.page, 10, this.infected, this.sessionNameFilter)
      .subscribe(
        (data) => {
          this.sessionData = data.sessions;
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

  resetFilter() {
    this.infected = undefined;
    this.loadSessions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
