const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');
const secure = require('./secure');

const router = express.Router();

function list(req, res) {
  Controller.list()
    .then((list) => {
      response.success(req, res, list, 200);
    })
    .catch((error) => {
      response.error(req, res, error.message, 500);
    });
}

function getUsersByRol(req, res) {
  const filterUsers = req.query.rol;
  Controller.getUsers(filterUsers)
    .then((userList) => {
      response.success(req, res, userList, 200);
    })
    .catch((error) => {
      response.error(req, res, error.message, 500);
    });
}

function getUser(req, res) {
  const { query } = req;
  Controller.getUser(query)
    .then((user) => {
      response.success(req, res, user, 200);
    })
    .catch((error) => {
      response.error(req, res, error.message, 500);
    });
}

function addUser(req, res) {
  const user = req.body;
  Controller.addUser(user)
    .then(() => {
      response.success(req, res, 'user created', 201);
    })
    .catch((error) => {
      response.error(req, res, error.message, 500);
    });
}
function addUsersCsv(req, res) {
  Controller.addUsersCsv(req.file)
    .then(() => {
      response.success(req, res, 'users created', 201);
    })
    .catch((error) => {
      response.error(req, res, error.message, 500);
    });
}

function update(req, res) {
  const { id } = req.params;
  const data = req.body;
  Controller.update(id, data)
    .then((user) => {
      response.success(req, res, 'user update', 200);
    })
    .catch((error) => {
      response.error(req, res, error.message, 500);
    });
}

router.get('/users', secure('globalSearch'), list);
router.get('/users-rol', secure('rolSearch'), getUsersByRol);
router.get('/users/user', secure('userSearch'), getUser);
router.post('/users', secure('createUser'), addUser);
router.post('/users-csv', secure('createUser'), addUsersCsv);
router.put('/users/:id', secure('updateUser'), update);

module.exports = router;
