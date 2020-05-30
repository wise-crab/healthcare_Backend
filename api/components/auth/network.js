const express = require('express');

const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();

function login(req, res) {
  Controller.login(req.body.username, req.body.password)
    .then((token) => {
      response.success(req, res, token, 200);
    })
    .catch((error) => {
      response.error(req, res, error.message, 401);
    });
}

router.post('/login', login);

module.exports = router;
