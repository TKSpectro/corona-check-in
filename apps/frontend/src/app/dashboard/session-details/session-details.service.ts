import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ServerService } from '../../shared/server.service';

@Injectable({
  providedIn: 'root',
})
export class SessionDetailsService {
  sessionData!: any;
  submitSessionData = new Subject<any>();

  constructor(private serverSrv: ServerService) {}

  getIncidenceData() {
    this.serverSrv.get().subscribe({
      next: (data) => {
        this.chartData = data;
        this.submitChartData.next(this.chartData);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
}
