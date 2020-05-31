const express = require('express');
const { format } = require('util');
const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const config = require('../../../config');

const response = require('../../../network/response');
const Controller = require('./index');
const notificationsController = require('../notifications/index');
const secure = require('./secure');

const router = express.Router();

const storage = new Storage();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const bucket = storage.bucket(config.bucket.name);

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
    Controller.upsert(req.body)
      .then((exam) => {
        const dataNotification = {
          idPatient: req.body.idPatient,
          dateOfNotification: new Date(),
          status: true,
          message: 'Realizando exámen',
        };

        notificationsController.upsert(dataNotification);

        return response.success(req, res, exam, 201);
      })
      .catch(next);
  } else {
    Controller.upsert(req.body)
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

function upload(req, res, next) {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', (error) => {
    response.error(req, res, error.message, 500);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
    );
    req.body.result = publicUrl;

    Controller.upsert(req.body)
      .then((exam) => {
        const dataNotification = {
          idPatient: req.body.idPatient,
          dateOfNotification: new Date(),
          status: true,
          message: 'Resultados disponibles',
        };

        notificationsController.upsert(dataNotification);

        return response.success(req, res, publicUrl, 201);
      })
      .catch(next);
    // response.success(req, res, publicUrl, 200);
  });

  blobStream.end(req.file.buffer);
}

router.get('/exams', secure('globalSearch'), list);
router.get('/exams/:id', secure('staff'), get);
router.get('/exams-query', secure('public'), query);
router.post('/exams', secure('addExam'), insert);
router.put('/exams', secure('addExam'), insert);
router.post(
  '/upload-exam',
  secure('staff'), multer.single('file'),
  upload,
);

module.exports = router;
