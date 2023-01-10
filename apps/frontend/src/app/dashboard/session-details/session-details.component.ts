import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { Session } from '../../shared/types';
import { SessionDetailsService } from './session-details.service';

@Component({
  selector: 'ccn-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss'],
})
export class SessionDetailsComponent implements OnInit {
  sessionData!: Session;
  subscription!: Subscription;

  constructor(
    private sessionDetailsService: SessionDetailsService,
    private route: ActivatedRoute
  ) {}

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  ngOnInit(): void {
    // TODO: This will be replaced by a service call
    const id = this.route.snapshot.url[1].path;
    this.sessionDetailsService.getSessionById(id);
    this.subscription = this.sessionDetailsService.submitSessionData.subscribe(
      (data) => {
        this.sessionData = data;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  saveNote() {
    this.sessionDetailsService.updateSession({
      id: this.sessionData.id,
      name: this.sessionData.name,
      startTime: this.sessionData.startTime,
      endTime: this.sessionData.endTime,
      infected: this.sessionData.infected,
      note: this.sessionData.note,
    });
  }
}
