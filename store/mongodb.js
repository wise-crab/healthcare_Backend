const db = require('mongoose');
const config = require('../config');
const UserModel = require('../api/components/user/model');

db.Promise = global.Promise;

db.connect(
  `mongodb+srv://${config.database.user}:${config.database.pass}@examedic-develop.edyky.gcp.mongodb.net`,
  { useNewUrlParser: true, useUnifiedTopology: true },
);

// console.info('[DB Connection] successfully');

async function list(table) {
  if (table === 'users') {
    const users = UserModel.find();
    return users;
  }

  return null;

}

module.exports = {
  list,
};
