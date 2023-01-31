import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { curveBumpX } from 'd3-shape';
import { Subscription } from 'rxjs';
import { IncidenceService } from './incidence.service';

@Component({
  selector: 'ccn-incidence',
  templateUrl: './incidence.component.html',
  styleUrls: ['./incidence.component.scss'],
})
export class IncidenceComponent implements OnInit, OnDestroy {
  incidenceChartData!: any;
  subscription!: Subscription;

  // chart options
  xAxis = true;
  yAxis = true;
  xAxisLabel = 'Date';
  yAxisLabel = '7-Day incidence';
  curve = curveBumpX;

  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;
  isExpanded!: boolean;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private incidenceService: IncidenceService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener(
      'change',
      (event) => (this.isExpanded = !event.matches)
    );
  }

  ngOnInit(): void {
    this.incidenceService.getIncidenceData();
    this.subscription = this.incidenceService.submitChartData.subscribe(
      (data) => {
        this.incidenceChartData = data;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
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

  xAxisTickFormatting(value: any) {
    return new Date(value).toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
