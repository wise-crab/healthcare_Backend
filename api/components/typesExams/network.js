const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');
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

function upsert(req, res, next) {
  Controller.upsert(req.body)
    .then((exam) => {
      response.success(req, res, exam, 201);
    })
    .catch(next);
}

router.get('/types-exams', /*secure('rolSearch'),*/ list);
router.get('/types-exams/:id', /*secure('rolSearch'),*/ get);
router.post('/types-exams', /*secure('rolSearch'),*/ upsert);
router.put('/types-exams', /*secure('rolSearch'),*/ upsert);

module.exports = router;
