import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('incidence-service') private incidenceClient: ClientProxy
  ) {}

  getIncidenceData() {
    return this.incidenceClient.send({ role: 'incidence', cmd: 'get' }, {});
  }
}
