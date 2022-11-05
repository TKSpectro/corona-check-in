import { Component, OnInit } from '@angular/core';
import { curveBumpX } from 'd3-shape';
import { multi } from './data';

@Component({
  selector: 'ccn-incidence',
  templateUrl: './incidence.component.html',
  styleUrls: ['./incidence.component.scss'],
})
export class IncidenceComponent implements OnInit {
  multi!: any[];
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

  ngOnInit(): void {
    // TODO: This will be replaced by a service call
    Object.assign(this, { multi });
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
