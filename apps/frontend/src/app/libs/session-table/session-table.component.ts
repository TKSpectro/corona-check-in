import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Session } from '../../shared/types';

@Component({
  selector: 'ccn-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.scss'],
})
export class SessionTableComponent implements OnInit {
  @Input() sessionList: Session[] = [];
  @Input() extraColumns: string[] = [];

  displayedColumns = ['startTime', 'endTime', 'infected'];

  @Output() markAsInfectedEvent = new EventEmitter<Session>();
  @Output() deleteEvent = new EventEmitter<string>();

  ngOnInit() {
    this.displayedColumns = this.displayedColumns.concat(this.extraColumns);
  }

  markAsInfected(session: Session) {
    this.markAsInfectedEvent.emit(session);
  }

  delete(session: Session) {
    this.deleteEvent.emit(session.id);
  }
}
