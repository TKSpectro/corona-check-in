import { Component, Input, OnInit } from '@angular/core';

interface Session {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  infected: boolean;
  note?: string;
}

@Component({
  selector: 'ccn-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.scss'],
})
export class SessionTableComponent implements OnInit {
  @Input() sessionList: Session[] = [];
  displayedColumns: string[] = ['startTime', 'endTime', 'infected'];

  constructor() {}

  ngOnInit(): void {}
}
