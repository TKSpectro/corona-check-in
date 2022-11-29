import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { SessionListService } from './session-list.service';

@Component({
  selector: 'ccn-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
})
export class SessionListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name'];
  sessionData!: any;
  subscription!: Subscription;
  _meta: any;
  pageEvent: PageEvent = new PageEvent();
  total!: number;
  limit!: number;
  page!: number;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.total = e.length;
    this.limit = e.pageSize;
    this.page = e.pageIndex;
    console.log(this.page);
    this.loadSessions;
  }
  constructor(private sessionListService: SessionListService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadSessions() {
    // TODO: This will be replaced by a service call
    this.sessionListService.getSessions(this.page);
    this.subscription = this.sessionListService.submitSessionData.subscribe(
      (data) => {
        this.sessionData = data.sessions;
        this._meta = data._meta;
      }
    );
  }
}
