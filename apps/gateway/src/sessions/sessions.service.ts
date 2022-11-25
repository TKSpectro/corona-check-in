import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SessionsService {
  constructor(@Inject('sessions-service') private sessionClient: ClientProxy) {}

  getSessions() {
    return this.sessionClient.send({ role: 'sessions', cmd: 'get-all' }, {});
  }
  getSessionById(id: string) {
    return this.sessionClient.send({ role: 'sessions', cmd: 'get-by-id' }, {});
  }
}
