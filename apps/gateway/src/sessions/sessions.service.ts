import {
  PageOptionsDto,
  RequestUser,
} from '@corona-check-in/micro-service-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { environment } from '../environments/environment';
import { SessionEntity } from './session.entity';
import { SessionDto } from './sessions.dto';
import { UpdateSessionDto } from './update-sessions.dto';

@Injectable()
export class SessionsService {
  constructor(@Inject('sessions-service') private sessionClient: ClientProxy) {}

  getSessions(
    pageOptionsDto: PageOptionsDto,
    user: RequestUser,
    infected?: boolean,
    sessionBegin?: Date,
    sessionEnd?: Date
  ) {
    return this.sessionClient
      .send(
        { role: 'session', cmd: 'get-all' },
        { pageOptionsDto, user, infected, sessionBegin, sessionEnd }
      )
      .pipe(timeout(environment.serviceTimeout));
  }

  getSessionById(id: string, user: RequestUser) {
    return this.sessionClient
      .send({ role: 'session', cmd: 'get-by-id' }, { id, user })
      .pipe(timeout(environment.serviceTimeout));
  }

  createSession(createSessionDto: SessionDto) {
    return this.sessionClient
      .send<SessionEntity>({ role: 'session', cmd: 'create' }, createSessionDto)
      .pipe(timeout(environment.serviceTimeout));
  }
  scanQrCode(createSessionDto: SessionDto & { userId: string }) {
    return this.sessionClient
      .send<SessionEntity>(
        { role: 'session', cmd: 'scan-code' },
        createSessionDto
      )
      .pipe(timeout(environment.serviceTimeout));
  }

  markLastSessionsAsInfected(userId: string) {
    return this.sessionClient
      .send({ role: 'session', cmd: 'mark-last-sessions-as-infected' }, userId)
      .pipe(timeout(environment.serviceTimeout));
  }

  updateSession(updateSessionDto: UpdateSessionDto) {
    return this.sessionClient
      .send<SessionEntity>({ role: 'session', cmd: 'update' }, updateSessionDto)
      .pipe(timeout(environment.serviceTimeout));
  }

  removeSession(id: string) {
    return this.sessionClient
      .send({ role: 'session', cmd: 'delete' }, id)
      .pipe(timeout(environment.serviceTimeout));
  }
}
