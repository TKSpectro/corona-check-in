import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ServerService } from '../../shared/server.service';

@Injectable({
  providedIn: 'root',
})
export class SessionListService {
  sessionData!: any;
  submitSessionData = new Subject<any>();

  constructor(private serverSrv: ServerService) {}

  getSessions(
    page = 0,
    limit = 10,
    infected?: boolean,
    sessionBegin?: string,
    sessionEnd?: string,
    sessionName?: string
  ) {
    return this.serverSrv.getSessions(
      page,
      limit,
      infected,
      sessionBegin,
      sessionEnd,
      sessionName
    );
  }
}
