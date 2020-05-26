const mongoose = require('mongoose');

const { Schema } = mongoose;

const authSchema = new Schema({
  userName: String,
  password: String,
  rol: String,
}, { collection: 'auth' });

const AuthModel = mongoose.model('auth', authSchema);
module.exports = AuthModel;
