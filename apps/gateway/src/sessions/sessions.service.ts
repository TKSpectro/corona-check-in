import {
  PageOptionsDto,
  RequestUser,
} from '@corona-check-in/micro-service-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { environment } from '../environments/environment';
import { SessionEntity } from './session.entity';
import { SessionDto } from './sessions.dto';
import { UpdateSessionDto } from './update-sessions.dto';

@Injectable()
export class SessionsService {
  constructor(@Inject('sessions-service') private sessionClient: ClientProxy) {}

  async getSessions(
    pageOptionsDto: PageOptionsDto,
    user: RequestUser,
    infected?: boolean,
    sessionBegin?: Date,
    sessionEnd?: Date
  ) {
    return await lastValueFrom(
      this.sessionClient
        .send(
          { role: 'session', cmd: 'get-all' },
          { pageOptionsDto, user, infected, sessionBegin, sessionEnd }
        )
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async getSessionById(id: string, user: RequestUser) {
    return lastValueFrom(
      this.sessionClient
        .send<SessionEntity[]>(
          { role: 'session', cmd: 'get-by-id' },
          { id, user }
        )
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async getCurrentSession(user: RequestUser) {
    return lastValueFrom(
      this.sessionClient
        .send({ role: 'session', cmd: 'get-current-session' }, { user })
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async createSession(createSessionDto: SessionDto) {
    return lastValueFrom(
      this.sessionClient
        .send<SessionEntity>(
          { role: 'session', cmd: 'create' },
          createSessionDto
        )
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async scanQrCode(createSessionDto: SessionDto & { userId: string }) {
    return lastValueFrom(
      this.sessionClient
        .send<SessionEntity>(
          { role: 'session', cmd: 'scan-code' },
          createSessionDto
        )
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async markLastSessionsAsInfected(user: RequestUser) {
    return lastValueFrom(
      this.sessionClient
        .send(
          { role: 'session', cmd: 'mark-last-sessions-as-infected' },
          { user }
        )
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async getCurrentStatus(user: RequestUser) {
    return lastValueFrom(
      this.sessionClient
        .send({ role: 'session', cmd: 'get-current-status' }, { user })
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async updateSession(updateSessionDto: UpdateSessionDto) {
    return lastValueFrom(
      this.sessionClient
        .send<SessionEntity>(
          { role: 'session', cmd: 'update' },
          updateSessionDto
        )
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async removeSession(id: string) {
    return lastValueFrom(
      this.sessionClient
        .send({ role: 'session', cmd: 'delete' }, id)
        .pipe(timeout(environment.serviceTimeout))
    );
  }
}
