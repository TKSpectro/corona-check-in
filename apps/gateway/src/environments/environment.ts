export const environment = {
  production: false,
  auth: {
    jwt: {
      secret: process.env['AUTH_JWT_SECRET'] || 'secretKey',
    },
  },
};
