const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');

const cors = require('cors');
const config = require('../config');

const app = express();


app.use(cors());

const user = require('./components/user/network');
const auth = require('./components/auth/network');

app.use(bodyParser.json());
const swaggerDoc = require('./swagger.json');

//Routes
app.use(user);
app.use(auth);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.listen(config.api.port, () => {
  process.stdout.write(`App listening at ${config.api.host}:${config.api.port} \n`);
});
