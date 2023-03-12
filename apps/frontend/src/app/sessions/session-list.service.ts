import { Injectable } from '@angular/core';
import { ServerService } from '../shared/server.service';
import { ScanQrCodeBody, Session } from '../shared/types';

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
    roomId?: string
  ) {
    return this.serverSrv.getSessions(
      page,
      take,
      infected,
      sessionBegin,
      sessionEnd,
      roomId
    );
  }

  markAsInfected(session: Session) {
    return this.serverSrv.updateSession({
      ...session,
      infected: true,
    });
  }

  deleteSession(sessionId: string) {
    return this.serverSrv.deleteSession(sessionId);
  }

  scanQrCode(scanBody: ScanQrCodeBody) {
    return this.serverSrv.scanQrCode(scanBody);
  }
}
