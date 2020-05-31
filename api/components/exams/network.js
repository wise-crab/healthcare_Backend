const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');
const notificationsController = require('../notifications/index');
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
  if (req.body._id) {

  } else {
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
}

function query(req, res) {
  const { user } = req.query;
  const { id } = req.query;

  Controller.query(user, id)
    .then((list) => {
      response.success(req, res, list, 200);
    })
    .catch((error) => {
      response.error(req, res, error.message, 500);
    });
}

router.get('/exams', secure('globalSearch'), list);
router.get('/exams/:id', secure('staff'), get);
router.get('/exams-query', secure('public'), query);
router.post('/exams', secure('addExam'), insert);
router.put('/exams', /*secure('addExam'),*/ insert);

module.exports = router;
