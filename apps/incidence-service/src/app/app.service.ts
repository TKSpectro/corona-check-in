import {
  PageOptionsDto,
  RequestUser,
} from '@corona-check-in/micro-service-shared';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DateTime } from 'luxon';
import { lastValueFrom, timeout } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class AppService {
  constructor(
    @Inject('room-service') private roomClient: ClientProxy,
    @Inject('session-service') private sessionClient: ClientProxy
  ) {}

  async get7DayAverage({
    user,
    roomId,
  }: {
    user: RequestUser;
    roomId?: string;
  }) {
    const pageOptionsDto: PageOptionsDto = {
      page: 0,
      take: 99999,
    };
    const startTime = DateTime.now().minus({ months: 2, days: 1 });

    if (roomId) {
      const room = await lastValueFrom(
        this.roomClient
          .send({ role: 'room', cmd: 'get-by-id' }, roomId)
          .pipe(timeout(environment.serviceTimeout))
      );

      if (!room) {
        throw new NotFoundException('Room not found');
      }
    }

    const { data: sessions } = await lastValueFrom(
      this.sessionClient
        .send(
          { role: 'session', cmd: 'get-all' },
          {
            pageOptionsDto,
            user,
            infected: 'true',
            sessionBegin: startTime.toJSDate(),
            roomId,
            allInternalToken: environment.allInternalToken,
          }
        )
        .pipe(timeout(environment.serviceTimeout))
    );

    const incidences = {};

    // Get the 7 day incidence average calculated from the average of the last 7 days
    sessions.forEach((session) => {
      const date = DateTime.fromISO(session.startTime).toISODate();
      if (!incidences[date]) {
        incidences[date] = 0;
      }
      incidences[date]++;
    });

    const incidenceArray = Object.keys(incidences)
      .map((key) => {
        return {
          date: key,
          incidence: incidences[key],
        };
      })
      .sort((a, b) => {
        return a.date > b.date ? 1 : -1;
      });

    // const incidenceAverage =
    //   incidenceArray.reduce((acc, cur) => {
    //     return acc + cur.incidence;
    //   }, 0) / incidenceArray.length;

    return [
      {
        name: roomId || 'Fachhochschule Erfurt',
        series: incidenceArray.map((item) => {
          return {
            name: item.date,
            value: item.incidence,
          };
        }),
      },
    ];
  }
}
