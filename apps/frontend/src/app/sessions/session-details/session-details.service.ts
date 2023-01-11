import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ServerService } from '../../shared/server.service';
import { Session } from '../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class SessionDetailsService {
  sessionData!: Session;
  submitSessionData = new Subject<Session>();

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

  updateSession(session: Session): Observable<Session> {
    return this.serverSrv.updateSession(session);
  }
}
