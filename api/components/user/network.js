const express = require('express');
const multer = require('multer');
const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();

const upload = multer({
  dest: 'public/files/',
});

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
  const { document } = req.params;
  Controller.getUser(document)
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
  const { document } = req.params;
  const data = req.body;
  Controller.update(document, data)
    .then((user) => {
      response.success(req, res, 'user update', 200);
    })
    .catch((error) => {
      response.error(req, res, error.message, 500);
    });
}

router.get('/users', list);
router.get('/users-rol', getUsersByRol);
router.get('/users/:document', getUser);
router.post('/users', addUser);
router.post('/users-csv', upload.single('file'), addUsersCsv);
router.put('/users/:document', update);

module.exports = router;
