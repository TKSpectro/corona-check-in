import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ccn-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss'],
})
export class SessionDetailsComponent implements OnInit {
  constructor(private incidenceService: IncidenceService) {}

  ngOnInit(): void {
    // TODO: This will be replaced by a service call

    this.incidenceService.getIncidenceData();
    this.subscription = this.incidenceService.submitChartData.subscribe(
      (data) => {
        this.incidenceChartData = data;
      }
    );
  }
}
