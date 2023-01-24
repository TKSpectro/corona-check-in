export const baseEnvironment = {
  production: false,
  db: {
    host: process.env['DB_HOST'] || 'localhost',
    port: process.env['DB_PORT'] || 5433,
    username: process.env['DB_USERNAME'] || 'postgres_user',
    password: process.env['DB_PASSWORD'] || 'postgres_password',
    database: process.env['DB_DATABASE'] || 'ccn',
  },
  redis: {
    host: process.env['REDIS_HOST'] || 'localhost',
    port: process.env['REDIS_PORT'] || 6379,
  },
  seedEnabled: process.env['SEEDING_ENABLED'] === 'true' ? true : false,
};
