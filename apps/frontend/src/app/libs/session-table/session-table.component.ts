import { Component, HostListener, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionDetailsComponent } from '../../sessions/session-details/session-details.component';
import { AdminService } from '../../auth/admin/admin.service';
import { Session } from '../../shared/types';

@Component({
  selector: 'ccn-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.scss'],
})
export class SessionTableComponent implements OnInit {
  @Input() sessionList: Session[] = [];
  @Input() extraColumns: string[] = [];
  @Output() markAsInfectedEvent = new EventEmitter<Session>();
  @Output() deleteEvent = new EventEmitter<string>();

  displayedColumns = ['startTime', 'endTime', 'infected', 'actions'];
  adminService: AdminService;

  constructor(adminService: AdminService, public dialog: MatDialog) {
    this.adminService = adminService;
  }

  ngOnInit() {
    this.displayedColumns = this.displayedColumns.concat(this.extraColumns);
  }

  markAsInfected(session: Session) {
    this.markAsInfectedEvent.emit(session);
  }

  delete(session: Session) {
    this.deleteEvent.emit(session.id);
  }
  
  @HostListener('click', ['$event'])
  openDialog(id: string, event: any) {
    event.stopPropagation();
    this.dialog.open(SessionDetailsComponent, {
      data: { id: id },
      panelClass: 'custom-dialog',
    });
  }
}
