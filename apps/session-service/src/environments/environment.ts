import { baseEnvironment } from '@corona-check-in/micro-service-shared';

export const environment = {
  seedMassRandom:
    process.env['SEEDING_MASS_SESSIONS_ENABLED'] === 'true' ? true : false,
  ...baseEnvironment,
};
