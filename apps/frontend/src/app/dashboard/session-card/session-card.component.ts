import { Component, OnDestroy, OnInit } from '@angular/core';
import { Session, User } from '../../shared/types';
import { Subscription } from 'rxjs';
import { ServerService } from '../../shared/server.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../libs';

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

  constructor(private serverSrv: ServerService, public dialog: MatDialog) {}

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
        },
        error: (error) => {
          console.log(error.error.message);
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
        .subscribe((data) => {
          this.sessionData = data;
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
              },
              error: (err) => console.error(err),
            })
          );
        }
      })
    );
  }
}
