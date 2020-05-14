const express = require('express');
const config = require('../config');

const app = express();

const user = require('./components/user/network');

app.use(user);

app.listen(config.api.port, () => {
  process.stdout.write(`App listening at ${config.api.host}:${config.api.port}`);
});
