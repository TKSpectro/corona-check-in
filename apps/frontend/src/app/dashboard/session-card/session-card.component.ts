import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../libs';
import { ServerService } from '../../shared/server.service';
import { Session } from '../../shared/types';

@Component({
  selector: 'ccn-session-card',
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.scss'],
})
export class SessionCardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  sessionData!: Session;
  sessionMarkedAsInfected = false;
  sessionLoaded = false;

  @Output() currentSessionEvent = new EventEmitter<Session>();

  constructor(
    private t: TranslateService,
    private snackBar: MatSnackBar,
    private serverSrv: ServerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCurrentSession();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getCurrentSession() {
    this.subscriptions.push(
      this.serverSrv.getCurrentSession().subscribe({
        next: (data) => {
          this.sessionData = data;
          this.sessionLoaded = true;
          this.currentSessionEvent.emit(this.sessionData);
        },
        error: (error) => {
          this.snackBar.open(
            this.t.instant('DASHBOARDS.LAST_SESSION_ERROR') +
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

  saveNote() {
    this.subscriptions.push(
      this.serverSrv
        .updateSession({
          id: this.sessionData.id,
          startTime: this.sessionData.startTime,
          endTime: this.sessionData.endTime,
          infected: this.sessionData.infected,
          note: this.sessionData.note,
        })
        .subscribe({
          next: (data) => {
            this.sessionData = data;
            this.snackBar.open(
              this.t.instant('DASHBOARDS.NOTE_UPDATE_SUCCESS'),
              undefined,
              {
                panelClass: 'snackbar-success',
              }
            );
          },
          error: (error) => {
            this.snackBar.open(
              this.t.instant('DASHBOARDS.NOTE_UPDATE_ERROR') +
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

  markLastSessionsAsInfected() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'SESSIONS.REPORT_INFECTION',
        description: 'SESSIONS.REPORT_INFECTION_WARNING',
      },
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.subscriptions.push(
            this.serverSrv.markLastSessionsAsInfected().subscribe({
              next: (data) => {
                this.sessionMarkedAsInfected = data;
                this.snackBar.open(
                  this.t.instant('DASHBOARDS.MARK_INFECTED_SUCCESS'),
                  undefined,
                  {
                    panelClass: 'snackbar-success',
                  }
                );
              },
              error: (error) => {
                this.snackBar.open(
                  this.t.instant('DASHBOARDS.MARK_INFECTED_ERROR') +
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
      })
    );
  }
}
