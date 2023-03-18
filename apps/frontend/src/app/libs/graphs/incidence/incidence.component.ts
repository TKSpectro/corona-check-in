import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { curveBumpX } from 'd3-shape';

@Component({
  selector: 'ccn-incidence',
  templateUrl: './incidence.component.html',
  styleUrls: ['./incidence.component.scss'],
})
export class IncidenceComponent implements OnDestroy {
  @Input() incidenceChartData!: any;

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
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener(
      'change',
      (event) => (this.isExpanded = !event.matches)
    );
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  xAxisTickFormatting(value: any) {
    return new Date(value).toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
