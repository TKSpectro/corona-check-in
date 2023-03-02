import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ServerService } from '../../shared/server.service';
import { CurrentStatus } from '../../shared/types';

@Component({
  selector: 'ccn-current-status',
  templateUrl: './current-status.component.html',
  styleUrls: ['./current-status.component.scss'],
})
export class CurrentStatusComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  currentStatus!: CurrentStatus;
  loaded = false;

  constructor(
    private t: TranslateService,
    private snackBar: MatSnackBar,
    private serverSrv: ServerService
  ) {}

  ngOnInit(): void {
    this.getCurrentStatus();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getCurrentStatus() {
    this.subscriptions.push(
      this.serverSrv.getCurrentStatus().subscribe({
        next: (data) => {
          this.currentStatus = data;
          this.loaded = true;
        },
        error: (error) => {
          this.snackBar.open(
            this.t.instant('DASHBOARDS.NOTE_UPDATE_ERROR') +
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
}
