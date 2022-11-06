export const environment = {
  production: false,
  db: {
    host: process.env['DB_HOST'] || 'localhost',
    port: process.env['DB_PORT'] || 5433,
    username: process.env['DB_USERNAME'] || 'postgres_user',
    password: process.env['DB_PASSWORD'] || 'postgres_password',
    database: process.env['DB_DATABASE'] || 'ccn',
  },
};
