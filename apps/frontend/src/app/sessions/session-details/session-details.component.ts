import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServerService } from '../../shared/server.service';
import { Session } from '../../shared/types';

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
    private serverSrv: ServerService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  ngOnInit(): void {
    if (this.data) {
      this.id = this.data.id;
      this.subscription.push(
        this.serverSrv.getSessionById(this.id).subscribe({
          next: (data) => {
            this.sessionData = data;
          },
          error: (error) => {
            console.log(error.error.message);
          },
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  saveNote() {
    this.subscription.push(
      this.serverSrv
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
