import { Component, Input } from '@angular/core';
import { Session } from '../../shared/types';

@Component({
  selector: 'ccn-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.scss'],
})
export class SessionTableComponent {
  @Input() sessionList: Session[] = [];
  displayedColumns: string[] = ['startTime', 'endTime', 'infected'];
}
