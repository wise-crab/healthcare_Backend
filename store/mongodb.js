const db = require('mongoose');
const config = require('../config');
const UserModel = require('../api/components/user/model');
const AuthModel = require('../api/components/auth/model');

db.Promise = global.Promise;

db.connect(
  `mongodb+srv://${config.database.user}:${config.database.pass}@${config.database.host}/${config.database.name}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
);

console.info('[DB Connection] successfully');

async function list(table) {
  if (table === 'users') {
    const users = UserModel.find();
    return users;
  }

  return null;

}

async function addUser(table, user) {
  if (table === 'users') {
    const myUser = new UserModel(user);
    return myUser.save();
  }
  if (table === 'auth') {
    const auth = new AuthModel(user);
    auth.save();
    return auth._id;
  }
}

async function getUsers(filterUsers) {
  const users = await UserModel.find({ rol: filterUsers, deleted: false });
  return users;
}

async function getUser(type, query) {
  if (type === 'numberId') {
    const user = await UserModel.findOne({ numberId: query });
    return user;
  }
  if (type === 'name') {
    const user = await UserModel.find({ name: query });
    return user;
  }
}

async function updateUser(id, data) {
  const user = await UserModel.updateOne({ _id: id }, data);
  return user;
}

async function login(username) {
  const user = await AuthModel.findOne({ userName: username });
  return user;
}

module.exports = {
  list,
  addUser,
  getUsers,
  getUser,
  updateUser,
  login,
};
