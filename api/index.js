const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');

const config = require('../config');

const app = express();

const user = require('./components/user/network');

app.use(bodyParser.json());
const swaggerDoc = require('./swagger.json');

//Routes
app.use(user);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.listen(config.api.port, () => {
  process.stdout.write(`App listening at ${config.api.host}:${config.api.port} \n`);
});
