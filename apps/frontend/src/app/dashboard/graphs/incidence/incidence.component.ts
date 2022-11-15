import { Component, OnInit } from '@angular/core';
import { curveBumpX } from 'd3-shape';
import { IncidenceService } from './incidence.service';

@Component({
  selector: 'ccn-incidence',
  templateUrl: './incidence.component.html',
  styleUrls: ['./incidence.component.scss'],
})
export class IncidenceComponent implements OnInit {
  incidenceChartData!: any;
  view: [number, number] = [700, 300];

  // chart options
  legend = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  yAxisLabel = '7-Day incidence';
  curve = curveBumpX;

  constructor(private incidenceService: IncidenceService) {}

  ngOnInit(): void {
    // TODO: This will be replaced by a service call

    this.incidenceService.getIncidenceData().subscribe((data) => {
      this.incidenceChartData = data;
    });
  }

  onSelect(data: any): void {
    console.log('Item clicked', data);
  }

  onActivate(data: any): void {
    console.log('Activate', data);
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', data);
  }
}
