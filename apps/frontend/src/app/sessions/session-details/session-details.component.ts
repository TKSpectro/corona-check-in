import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Session } from '../../shared/types';
import { SessionDetailsService } from './session-details.service';

@Component({
  selector: 'ccn-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss'],
})
export class SessionDetailsComponent implements OnInit, OnDestroy {
  sessionData!: Session;
  subscription: Subscription[] = [];
  id = '';

  constructor(
    private sessionDetailsService: SessionDetailsService,
    private route: ActivatedRoute
  ) {}

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  ngOnInit(): void {
    this.subscription.push(
      this.route.paramMap.subscribe((params) => {
        this.id = params.has('id') ? params.get('id') || '' : '';
      })
    );
    this.sessionDetailsService.getSessionById(this.id);
    this.subscription.push(
      this.sessionDetailsService.submitSessionData.subscribe((data) => {
        this.sessionData = data;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  saveNote() {
    this.subscription.push(
      this.sessionDetailsService
        .updateSession({
          id: this.sessionData.id,
          name: this.sessionData.name,
          startTime: this.sessionData.startTime,
          endTime: this.sessionData.endTime,
          infected: this.sessionData.infected,
          note: this.sessionData.note,
        })
        .subscribe((data) => {
          this.sessionData = data;
        })
    );
  }
}
