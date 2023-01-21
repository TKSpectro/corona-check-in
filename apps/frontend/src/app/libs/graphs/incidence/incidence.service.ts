import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ServerService } from '../../../shared/server.service';

@Injectable({
  providedIn: 'root',
})
export class IncidenceService {
  chartData!: any;
  submitChartData = new Subject<any>();

  constructor(private serverSrv: ServerService) {}

  getIncidenceData() {
    this.serverSrv.getIncidenceData().subscribe({
      next: (data) => {
        this.chartData = data;
        this.submitChartData.next(this.chartData);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
