import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionDetailsComponent } from '../../sessions/session-details/session-details.component';
import { AdminService } from '../../auth/admin/admin.service';
import { Session } from '../../shared/types';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ccn-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.scss'],
})
export class SessionTableComponent implements OnInit, OnDestroy {
  @Input() sessionList: Session[] = [];
  @Input() extraColumns: string[] = [];
  @Output() markAsInfectedEvent = new EventEmitter<Session>();
  @Output() deleteEvent = new EventEmitter<string>();

  subscriptions: Subscription[] = [];
  displayedColumns = ['startTime', 'endTime', 'infected'];
  adminService: AdminService;

  constructor(adminService: AdminService, public dialog: MatDialog) {
    this.adminService = adminService;
  }

  ngOnInit() {
    this.displayedColumns = this.displayedColumns.concat(this.extraColumns);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  markAsInfected(session: Session) {
    this.markAsInfectedEvent.emit(session);
  }

  delete(session: Session) {
    this.deleteEvent.emit(session.id);
  }

  openSessionDetailsDialog(id: string, event: any) {
    event.stopPropagation();
    this.dialog.open(SessionDetailsComponent, {
      data: { id: id },
      panelClass: 'custom-dialog',
    });
  }

  handleDelete(session: Session, event: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'SESSIONS.DELETE_SESSION',
        description: 'SESSIONS.DELETE_SESSION_WARNING',
      },
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.delete(session);
        }
      })
    );
  }

  handleInfectionMarking(session: Session, event: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'SESSIONS.MARK_SESSION_INFECTED',
        description: 'SESSIONS.MARK_SESSION_INFECTED_WARNING',
      },
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.markAsInfected(session);
        }
      })
    );
  }
}
