require('dotenv').config();

module.exports = {
  api: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secreto',
  },
  email: {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  database: {
    user: process.env.DATABASE_USER_DEV,
    pass: process.env.DATABASE_PASS_DEV,
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
  },
};
