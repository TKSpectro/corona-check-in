import { RequestUser } from '@corona-check-in/micro-service-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class IncidenceService {
  constructor(
    @Inject('incidence-service') private incidenceClient: ClientProxy
  ) {}
  async get7DayAverage(user: RequestUser) {
    return lastValueFrom(
      this.incidenceClient
        .send({ role: 'incidence', cmd: 'get-7-day-average' }, { user })
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async get7DayAverageForRoom(user: RequestUser, roomId: string) {
    return lastValueFrom(
      this.incidenceClient
        .send(
          { role: 'incidence', cmd: 'get-7-day-average-for-room' },
          { user, roomId }
        )
        .pipe(timeout(environment.serviceTimeout))
    );
  }
}
