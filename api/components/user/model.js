const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  numberId: Number,
  name: String,
  lastName: String,
  email: String,
  contactNumber: Number,
  userName: String,
  rol: String,
  deleted: Boolean,
  idAuth: mongoose.Types.ObjectId,
});

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;
