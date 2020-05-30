const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');
const notificationsController = require('../notifications/index');
// const secure = require('./secure');

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

function get(req, res) {
  Controller.get(req.params.id)
    .then((exam) => {
      response.success(req, res, exam, 200);
    })
    .catch((error) => {
      response.error(req, res, error.message, 500);
    });
}

function insert(req, res, next) {
  Controller.insert(req.body)
    .then((exam) => {

      const dataNotification = {
        idPatient: req.body.idPatient,
        dateOfNotification: new Date(),
        status: true,
        message: 'Nuevo examen asignado',
      };

      notificationsController.upsert(dataNotification);

      return response.success(req, res, exam, 201);
    })
    .catch(next);
}

router.get('/exams', /*secure('rolSearch'),*/ list);
router.get('/exams/:id', /*secure('rolSearch'),*/ get);
router.post('/exams', /*secure('rolSearch'),*/ insert);

module.exports = router;
