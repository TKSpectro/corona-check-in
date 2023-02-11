import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { IncidenceService } from '../libs/graphs/incidence/incidence.service';
import { SessionListService } from '../sessions/session-list.service';
import { IncidenceResult, ScanQrCodeBody } from '../shared/types';
import { SessionCardComponent } from './session-card/session-card.component';

@Component({
  selector: 'ccn-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;
  isExpanded!: boolean;

  sessionListSub!: Subscription;
  sessionList = [];

  @ViewChild(SessionCardComponent) sessionCardChild!: SessionCardComponent;

  incidenceChartDataSub!: Subscription;
  incidenceChartData: IncidenceResult[] = [];

  constructor(
    public t: TranslateService,
    private snackBar: MatSnackBar,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    private sessionListService: SessionListService,
    private incidenceService: IncidenceService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1150px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener(
      'change',
      (event) => (this.isExpanded = !event.matches)
    );
  }

  ngOnInit(): void {
    this.sessionListSub = this.sessionListService.getSessions(0, 5).subscribe({
      next: (data) => {
        this.sessionList = data.data;
      },
      error: (error) => {
        this.snackBar.open(
          this.t.instant('DASHBOARDS.SESSIONS_ERROR') +
            '\n' +
            error.error.message,
          undefined,
          {
            panelClass: 'snackbar-error',
          }
        );
      },
    });

    this.incidenceChartDataSub = this.incidenceService
      .getIncidenceData()
      .subscribe({
        next: (data) => {
          this.incidenceChartData = data;
        },
        error: (error) => {
          this.snackBar.open(
            this.t.instant('INCIDENCE_CHART.LOAD_INCIDENCE_ERROR') +
              '\n' +
              error.error.message,
            undefined,
            {
              panelClass: 'snackbar-error',
            }
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.sessionListSub.unsubscribe();
    this.incidenceChartDataSub.unsubscribe();
  }

  onScan($event: ScanQrCodeBody) {
    this.sessionListService.scanQrCode($event).subscribe({
      next: async () => {
        this.snackBar.open(
          await firstValueFrom(
            this.t.get('DASHBOARDS.SCAN_QR_CODE_SUCCESSFUL')
          ),
          undefined,
          {
            panelClass: 'snackbar-success',
          }
        );

        // TODO: pass id to session card and check if the session there
        this.sessionCardChild.getCurrentSession();
      },
      error: (error) => {
        this.snackBar.open(
          this.t.instant(
            'PROFILES.LOAD_PROFILE_ERROR' + '\n' + error.error.message
          ),
          undefined,
          {
            panelClass: 'snackbar-error',
          }
        );
      },
    });
  }
}
