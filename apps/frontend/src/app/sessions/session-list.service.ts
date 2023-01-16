import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ServerService } from '../shared/server.service';

@Injectable({
  providedIn: 'root',
})
export class SessionListService {
  constructor(private serverSrv: ServerService) {}

  getSessions(
    page = 0,
    take = 10,
    infected?: boolean,
    sessionBegin?: string,
    sessionEnd?: string,
    sessionName?: string
  ) {
    return this.serverSrv.getSessions(
      page,
      take,
      infected,
      sessionBegin,
      sessionEnd,
      sessionName
    );
  }
}
