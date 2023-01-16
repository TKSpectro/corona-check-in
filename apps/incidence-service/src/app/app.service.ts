import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Welcome to incidence-service!' };
  }

  getIncidence() {
    const today = DateTime.now();

    const requestData = [];
    for (let i = 20; i > 0; i--) {
      requestData.push({
        date: today.minus({ weeks: i }),
        value: Math.floor(Math.random() * 100),
      });
    }

    const multi = [
      {
        name: 'Fachhochschule Erfurt',
        series: requestData.map((item) => {
          return {
            name: item.date,
            value: item.value,
          };
        }),
      },
    ];

    return multi;
  }
}
