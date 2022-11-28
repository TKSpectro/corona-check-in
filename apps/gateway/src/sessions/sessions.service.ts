import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SessionsService {
  constructor(@Inject('sessions-service') private sessionClient: ClientProxy) {}

  getSessions(skip: number, limit: number) {
    return this.sessionClient.send(
      { role: 'sessions', cmd: 'get-all' },
      { skip, limit }
    );
  }
  getSessionById(id: string) {
    return this.sessionClient.send({ role: 'sessions', cmd: 'get-by-id' }, {});
  }
}
