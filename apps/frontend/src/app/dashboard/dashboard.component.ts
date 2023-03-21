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
import { TitleService } from '../shared/title.service';
import { IncidenceResult, ScanQrCodeBody } from '../shared/types';
import { SessionCardComponent } from './session-card/session-card.component';

@Component({
  selector: 'ccn-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;
  isExpanded!: boolean;

  sessionList = [];
  sessionListEmpty = false;

  @ViewChild(SessionCardComponent) sessionCardChild!: SessionCardComponent;

  incidenceChartData: IncidenceResult[] = [];

  constructor(
    public t: TranslateService,
    private snackBar: MatSnackBar,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    private sessionListService: SessionListService,
    private incidenceService: IncidenceService,
    private titleService: TitleService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1150px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener(
      'change',
      (event) => (this.isExpanded = !event.matches)
    );
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.t.get('DASHBOARD').subscribe((res: string) => {
        this.titleService.setTitle(res);
      })
    );

    this.getCurrentSessions();

    this.subscriptions.push(
      this.incidenceService.getIncidenceData().subscribe({
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
      })
    );
  }

  getCurrentSessions() {
    this.subscriptions.push(
      this.sessionListService.getSessions(0, 5).subscribe({
        next: (data) => {
          this.sessionList = data.data;

          if (this.sessionList.length > 0) {
            this.sessionListEmpty = false;
          } else {
            this.sessionListEmpty = true;
          }
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
      })
    );
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onScan($event: ScanQrCodeBody) {
    this.subscriptions.push(
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
          this.getCurrentSessions();
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
      })
    );
  }
}
