import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionDetailsComponent } from '../../sessions/session-details/session-details.component';
import { Session } from '../../shared/types';

@Component({
  selector: 'ccn-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.scss'],
})
export class SessionTableComponent {
  @Input() sessionList: Session[] = [];
  displayedColumns: string[] = ['startTime', 'endTime', 'infected', 'actions'];
  constructor(public dialog: MatDialog) {}

  openDialog(id: string) {
    this.dialog.open(SessionDetailsComponent, {
      data: { id: id },
    });
  }
}
