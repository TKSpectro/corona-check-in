import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ServerService } from '../../shared/server.service';
import { Session } from '../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class SessionDetailsService {
  sessionData!: any;
  submitSessionData = new Subject<any>();

  constructor(private serverSrv: ServerService) {}

  getSessionById(id: string) {
    this.serverSrv.getSessionById(id).subscribe({
      next: (data) => {
        this.sessionData = data;
        this.submitSessionData.next(this.sessionData);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  updateSession(session: Session) {
    this.serverSrv.updateSession(session).subscribe({
      error: (error) => {
        console.error(error);
      },
    });
  }
}
