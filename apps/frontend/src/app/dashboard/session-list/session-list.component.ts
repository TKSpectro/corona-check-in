import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionListService } from './session-list.service';

@Component({
  selector: 'ccn-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
})
export class SessionListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name'];
  sessionData!: any;
  subscription!: Subscription;

  constructor(private sessionListService: SessionListService) {}

  ngOnInit(): void {
    // TODO: This will be replaced by a service call

    this.sessionListService.getSessions();
    this.subscription = this.sessionListService.submitSessionData.subscribe(
      (data) => {
        this.sessionData = data;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
