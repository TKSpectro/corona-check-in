import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SessionListService } from '../sessions/session-list.service';

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

  constructor(
    public t: TranslateService,
    private snackBar: MatSnackBar,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    private sessionListService: SessionListService
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
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.sessionListSub.unsubscribe();
  }
}
