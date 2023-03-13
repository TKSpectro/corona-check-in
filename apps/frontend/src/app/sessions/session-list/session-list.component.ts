import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
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
  sessionListEmpty = false;
  subscriptions: Subscription[] = [];
  _meta: any;
  pageEvent: PageEvent = new PageEvent();
  total!: number;
  limit!: number;
  page!: number;
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

  constructor(
    private t: TranslateService,
    private snackBar: MatSnackBar,
    private sessionListService: SessionListService
  ) {}

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
          this.sessionEnd?.toDateString()
        )
        .subscribe({
          next: (data) => {
            this.sessionList = data.data;
            this._meta = data._meta;

            if (this.sessionList.length > 0) {
              this.sessionListEmpty = false;
            } else {
              this.sessionListEmpty = true;
            }
          },
          error: (error) => {
            this.snackBar.open(
              this.t.instant('SESSIONS.LOAD_SESSIONS_ERROR') +
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

  toggleInfectionFilter() {
    if (this.infected === undefined) {
      this.infected = true;
    } else if (this.infected === true) {
      this.infected = false;
    } else if (this.infected === false) {
      this.infected = undefined;
    }

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
          this.snackBar.open(
            this.t.instant('SESSIONS.MARK_INFECTED_SUCCESS'),
            undefined,
            {
              panelClass: 'snackbar-success',
            }
          );
        },
        error: (error) => {
          this.snackBar.open(
            this.t.instant('SESSIONS.MARK_INFECTED_ERROR') +
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

  deleteSession(sessionId: string) {
    this.subscriptions.push(
      this.sessionListService.deleteSession(sessionId).subscribe({
        next: () => {
          this.loadSessions();
        },
        error: (error) => {
          this.snackBar.open(
            this.t.instant('SESSIONS.DELETE_SESSION_ERROR') +
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

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
