require('dotenv').config();

module.exports = {
  api: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
};
