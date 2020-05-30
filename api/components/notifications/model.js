const mongoose = require('mongoose');

const { Schema } = mongoose;

const notificationsSchema = new Schema({
  idPatient: mongoose.ObjectId,
  dateOfNotification: Date,
  status: Boolean,
  message: String,
});

const notificationsModel = mongoose.model('notifications', notificationsSchema);
module.exports = notificationsModel;
