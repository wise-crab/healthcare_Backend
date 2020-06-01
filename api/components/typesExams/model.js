const mongoose = require('mongoose');

const { Schema } = mongoose;

const typeExamsSchema = new Schema({
  name: String,
  deleted: Boolean,
  registrationDate: Date,
});

const typeExamModel = mongoose.model('typesexams', typeExamsSchema);
module.exports = typeExamModel;
