import {
  PageOptionsDto,
  RequestUser,
} from '@corona-check-in/micro-service-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
    return this.sessionClient.send(
      { role: 'sessions', cmd: 'get-all' },
      { pageOptionsDto, user, infected, sessionBegin, sessionEnd }
    );
  }

  getSessionById(id: string, user: RequestUser) {
    return this.sessionClient.send(
      { role: 'session', cmd: 'get-by-id' },
      { id, user }
    );
  }

  getCurrentSession(user: RequestUser) {
    return this.sessionClient.send(
      { role: 'session', cmd: 'get-current-session' },
      { user }
    );
  }

  createSession(createSessionDto: SessionDto & { userId: string }) {
    return this.sessionClient.send<SessionEntity>(
      { role: 'session', cmd: 'create-session' },
      createSessionDto
    );
  }
  scanQrCode(createSessionDto: SessionDto & { userId: string }) {
    return this.sessionClient.send<SessionEntity>(
      { role: 'session', cmd: 'scan-code' },
      createSessionDto
    );
  }

  markLastSessionsAsInfected(userId: string) {
    return this.sessionClient.send(
      { role: 'session', cmd: 'markLastSessionsAsInfected' },
      userId
    );
  }

  updateSession(updateSessionDto: UpdateSessionDto) {
    return this.sessionClient.send<SessionEntity>(
      { role: 'session', cmd: 'update-session' },
      updateSessionDto
    );
  }

  removeSession(id: string) {
    return this.sessionClient.send(
      { role: 'session', cmd: 'delete-session' },
      id
    );
  }
}
