import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Session } from '../../shared/types';
import { SessionListService } from '../session-list.service';

@Component({
  selector: 'ccn-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
})
export class SessionListComponent implements OnInit, OnDestroy {
  sessionList!: any;
  subscriptions: Subscription[] = [];
  _meta: any;
  pageEvent: PageEvent = new PageEvent();
  total!: number;
  limit!: number;
  page!: number;
  sessionNameFilter?: string;
  infected?: boolean;
  sessionBegin?: Date;
  sessionEnd?: Date;

  sessionTableExtraColumns: string[] = ['actions'];

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

  constructor(private sessionListService: SessionListService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions() {
    this.subscriptions.push(
      this.sessionListService
        .getSessions(
          this.page,
          10,
          this.infected,
          this.sessionBegin?.toDateString(),
          this.sessionEnd?.toDateString(),
          this.sessionNameFilter
        )
        .subscribe({
          next: (data) => {
            this.sessionList = data.data;
            this._meta = data._meta;
          },
          error: (err) => console.error(err),
        })
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

  markAsInfected(session: Session) {
    this.subscriptions.push(
      this.sessionListService.markAsInfected(session).subscribe({
        next: () => {
          this.loadSessions();
        },
        error: (err) => console.error(err),
      })
    );
  }

  deleteSession(sessionId: string) {
    this.subscriptions.push(
      this.sessionListService.deleteSession(sessionId).subscribe({
        next: () => {
          this.loadSessions();
        },
        error: (err) => console.error(err),
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
