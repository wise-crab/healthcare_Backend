const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const app = express();
const server = require('http').Server(app);

const config = require('../config');
const socket = require('../socket');

const user = require('./components/user/network');
const auth = require('./components/auth/network');
const typesExams = require('./components/typesExams/network');
const exams = require('./components/exams/network');
const swaggerDoc = require('./swagger.json');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

socket.connect(server);

//Routes
app.use(user);
app.use(auth);
app.use(typesExams);
app.use(exams);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

server.listen(config.api.port, () => {
  process.stdout.write(
    `App listening at ${config.api.host}:${config.api.port} \n`,
  );
});
