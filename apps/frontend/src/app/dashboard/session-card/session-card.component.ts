import { Component, OnDestroy, OnInit } from '@angular/core';
import { Session, User } from '../../shared/types';
import { Subscription } from 'rxjs';
import { ServerService } from '../../shared/server.service';

@Component({
  selector: 'ccn-session-card',
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.scss'],
})
export class SessionCardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  sessionData!: Session;
  profileData!: User;
  sessionMarkedAsInfected = false;

  constructor(private serverSrv: ServerService) {}

  ngOnInit(): void {
    this.getProfileData();
    this.getCurrentSession();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getCurrentSession() {
    this.subscriptions.push(
      this.serverSrv.getCurrentSession().subscribe({
        next: (data) => {
          this.sessionData = data;
        },
        error: (error) => {
          console.log(error.error.message);
        },
      })
    );
  }

  getProfileData() {
    this.serverSrv.me().subscribe({
      next: (result) => {
        this.profileData = result;
      },
      error: (error) => {
        console.error(error);
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
              this.sessionMarkedAsInfected = data.success;
            },
            error: (err) => console.error(err),
          })
      );
    }
  }
}
