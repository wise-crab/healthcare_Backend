const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  numberId: 'Number',
  name: 'string',
  lastName: 'string',
  email: 'string',
  contactNumber: 'Number',
  userName: 'string',
  rol: 'string',
  deleted: 'boolean',
  idAuth: 'ObjectId',
});

const modelUser = mongoose.model('user', userSchema);
module.exports = modelUser;
