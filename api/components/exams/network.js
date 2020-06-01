const express = require('express');
const { format } = require('util');
const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');
// const pdf = require('html-pdf');
// const PDFDocument = require('pdfkit');
// const base64Img = require('base64-img');
const i2b = require('imageurl-base64');
// const request = require('request').defaults({ encoding: null });
const pdf = require('html-pdf');

const { socket } = require('../../../socket');

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

        socket.io.emit('message', dataNotification);

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

        socket.io.emit('message', dataNotification);

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

function download(req, res, next) {
  // const doc = new PDFDocument();
  const pdfResults = bucket.file(`${req.body.username}.pdf`);

  // // doc.pipe(fs.createWriteStream('output.pdf'));
  // doc.pipe(pdfResults.createWriteStream()).on('finish', () => {
  //   // console.log(pdfResults);
  //   return response.success(
  //     req,
  //     res,
  //     `https://storage.cloud.google.com/examedic-exams/${req.body.username}.pdf`,
  //     201,
  //   );
  // });

  // pdf.create(content).toFile(, (err, res) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(res);
  //     return response.success(
  //       req,
  //       res,
  //       `https://storage.cloud.google.com/examedic-exams/${req.body.username}.pdf`,
  //       201,
  //     );
  //   }
  // });

  // async function getImageBase64() {
  //   try {
  //     const baseImg = await urlConversionBase64(req.body.results[0]);
  //     console.log(baseImg);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  // console.log('corriendo');
  // getImageBase64();

  // request.get(req.body.results[0], (error, response, body) => {
  //   if (!error && response.statusCode == 200) {
  //     data =
  //       'data:' +
  //       response.headers['content-type'] +
  //       ';base64,' +
  //       Buffer.from(body).toString('base64');
  //     console.log(data);
  //   }
  // });

  // base64Img.requestBase64(req.body.results[0], (err, res, body) => {
  //   if (err) {
  //     console.log('error', err);
  //   } else {
  //     // console.log();
  //     console.log(body);
  //   }
  // });

  let content = `
  <h5>Resultado de examenes</h5>
  `;

  const values = req.body.results;
  console.log(values);

  const reee = values.map((element) => {
    content += `<img src="${element}" width="500" height="500">`;
    i2b(element, (err, data) => {
      if (err) {
        console.log(err);
        return false;
      }
      // console.log(data.dataUri);

      content += `<img src="${element}" width="500" height="500">`;
      return content;

      // console.log(content);

      // console.log(data.base64);
      // console.log(data.mimeType);
      // const imss = data.base64;
      // doc.image(imss, { width: 400 });
      // doc.image(
      //   new Buffer(
      //     data.dataUri.replace('data:text/html; charset=UTF-8;base64,', ''),
      //     'base64',
      //   ),
      //   100,
      //   100,
      // );
      // doc.image(
      //   new Buffer(
      //     data.dataUri.replace('data:text/html; charset=UTF-8;base64,', ''),
      //     'base64',
      //   ),
      //   100,
      //   100,
      // );
    });
  });
  console.log(content);
  pdf.create(content).toStream((err, stream) => {
    if (err) {
      response.error(req, res, err, 500);
    } else {
      stream.pipe(pdfResults.createWriteStream()).on('finish', () => {
        return response.success(
          req,
          res,
          `https://storage.cloud.google.com/examedic-exams/${req.body.username}.pdf`,
          201,
        );
      });
      // return response.success(
      //   req,
      //   res,
      //   `https://storage.cloud.google.com/examedic-exams/${req.body.username}.pdf`,
      //   201,
      // );
    }
  });

  // doc.image(
  //   new Buffer(image.replace('data:image/png;base64,', ''), 'base64'),
  //   100,
  //   100,
  // );

  // doc.image(data, { width: 400 });
  // doc.text('Examenes');

  // doc.end();
}

router.get('/exams', secure('globalSearch'), list);
router.get('/exams/:id', secure('staff'), get);
router.get('/exams-query', secure('public'), query);
router.post('/exams', secure('addExam'), insert);
router.put('/exams', secure('addExam'), insert);
router.post('/upload-exam', /*secure('staff'),*/ multer.single('file'), upload);
router.get(
  '/download-results',
  /*secure('staff'), multer.single('file'),*/
  download,
);

module.exports = router;
