const requestData = [
  {
    date: '2019-01-01',
    value: 10,
  },
  {
    date: '2019-01-02',
    value: 14,
  },
  {
    date: '2019-01-03',
    value: 14,
  },
  {
    date: '2019-01-04',
    value: 14,
  },
  {
    date: '2019-01-05',
    value: 8,
  },
  {
    date: '2019-01-06',
    value: 4,
  },
];

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
