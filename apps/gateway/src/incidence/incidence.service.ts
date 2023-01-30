import { RequestUser } from '@corona-check-in/micro-service-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class IncidenceService {
  constructor(
    @Inject('incidence-service') private incidenceClient: ClientProxy
  ) {}
  get7DayAverage(user: RequestUser) {
    return this.incidenceClient
      .send({ role: 'incidence', cmd: 'get-7-day-average' }, { user })
      .pipe(timeout(environment.serviceTimeout));
  }

  get7DayAverageForRoom(user: RequestUser, roomId: string) {
    return this.incidenceClient
      .send(
        { role: 'incidence', cmd: 'get-7-day-average-for-room' },
        { user, roomId }
      )
      .pipe(timeout(environment.serviceTimeout));
  }
}
