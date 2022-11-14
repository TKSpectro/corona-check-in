import { DateTime } from 'luxon';

const today = DateTime.now();

const requestData = [];
for (let i = 20; i > 0; i--) {
  requestData.push({
    date: today.minus({ weeks: i }).toISODate(),
    value: Math.floor(Math.random() * 100),
  });
}

export const multi = [
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
