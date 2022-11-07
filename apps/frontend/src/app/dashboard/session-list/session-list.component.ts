import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'ccn-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
})
export class SessionListComponent implements OnInit {
  displayedColumns: string[] = [
    'room',
    'starttime',
    'endtime',
  ];  

  EmpData: unknown[] = [
    {
      id: 1,
      room: '5.1.05',
      starttime: '25.10.2022 13:37',
      endtime: '25.10.2022 16:37',
    },
    {
      id: 2,
      room: '5.1.05',
      starttime: '01.11.2022 13:37',
      endtime: '01.11.2022 13:37',
    },
  ];

  dataSource = new MatTableDataSource(this.EmpData);
  constructor() {}

  ngAfterViewInit() {}
  ngOnInit(): void {}
}
