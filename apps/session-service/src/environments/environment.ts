import { baseEnvironment } from '@corona-check-in/micro-service-shared';

export const environment = {
  seedMassRandom: process.env['SEED_MASS_RANDOM'] === 'true' ? true : false,
  ...baseEnvironment,
};
