import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SessionEntity } from './session.entity';
import { UpdateSessionDto } from './sessions.dto';

@Injectable()
export class SessionsService {
  constructor(@Inject('sessions-service') private sessionClient: ClientProxy) {}

  getSessions(
    pageOptionsDto: PageOptionsDto,
    infected?: boolean,
    sessionBegin?: Date,
    sessionEnd?: Date
  ) {
    return this.sessionClient.send(
      { role: 'sessions', cmd: 'get-all' },
      { pageOptionsDto, infected, sessionBegin, sessionEnd }
    );
  }
  getSessionById(id: string) {
    return this.sessionClient.send(
      { role: 'sessions', cmd: 'get-by-id' },
      { id }
    );
  }

  updateSession(updateSessionDto: UpdateSessionDto) {
    return this.sessionClient.send<SessionEntity>(
      { role: 'sessions', cmd: 'update-session' },
      updateSessionDto
    );
  }
}
