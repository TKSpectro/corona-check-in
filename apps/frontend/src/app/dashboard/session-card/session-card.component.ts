import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ServerService } from '../../shared/server.service';
import { User } from '../../shared/types';

@Component({
  selector: 'ccn-session-card',
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.scss'],
})
export class SessionCardComponent implements OnInit {
  subscriptions: Subscription[] = [];
  profileData!: User;
  success = false;

  constructor(
    private t: TranslateService,
    private snackBar: MatSnackBar,
    private serverSrv: ServerService
  ) {}

  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData() {
    this.serverSrv.me().subscribe({
      next: (result) => {
        this.profileData = result;
      },
      error: (error) => {
        this.snackBar.open(
          this.t.instant('DASHBOARDS.ME_ERROR') + '\n' + error.error.message,
          undefined,
          {
            panelClass: 'snackbar-error',
          }
        );
      },
    });
  }

  markLastSessionsAsInfected() {
    if (this.profileData.id) {
      this.subscriptions.push(
        this.serverSrv
          .markLastSessionsAsInfected(this.profileData.id)
          .subscribe({
            next: (data) => {
              this.success = data.success;
            },
            error: (error) => {
              this.snackBar.open(
                this.t.instant('DASHBOARDS.MARK_INFECTED_ERROR') +
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
}
