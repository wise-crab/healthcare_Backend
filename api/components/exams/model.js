const mongoose = require('mongoose');

const { Schema } = mongoose;

const examsSchema = new Schema({
  idPatient: mongoose.ObjectId,
  idBacteriologist: mongoose.ObjectId,
  idDoctor: mongoose.ObjectId,
  registrationDate: Date,
  typeOfExam: String,
  status: String,
  deleted: Boolean,
  resultsDate: Date,
});

const examModel = mongoose.model('exams', examsSchema);
module.exports = examModel;
