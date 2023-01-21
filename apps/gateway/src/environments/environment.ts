import { baseEnvironment } from '@corona-check-in/micro-service-shared';

export const environment = {
  ...baseEnvironment,
  auth: {
    jwt: {
      secret: process.env['AUTH_JWT_SECRET'] || 'secretKey',
    },
  },
};
