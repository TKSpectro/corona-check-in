import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SessionsService {
  constructor(@Inject('sessions-service') private sessionClient: ClientProxy) {}

  getSessions(
    pageOptionsDto: PageOptionsDto,
    infected?: boolean,
    sessionName?: string,
    sessionBegin?: Date,
    sessionEnd?: Date
  ) {
    return this.sessionClient.send(
      { role: 'sessions', cmd: 'get-all' },
      { pageOptionsDto, infected, sessionName, sessionBegin, sessionEnd }
    );
  }
  getSessionById(id: string) {
    return this.sessionClient.send(
      { role: 'sessions', cmd: 'get-by-id' },
      { id }
    );
  }
}
