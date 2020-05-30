const db = require('mongoose');
const config = require('../config');
const UserModel = require('../api/components/user/model');
const AuthModel = require('../api/components/auth/model');
const TypeExamsModel = require('../api/components/typesExams/model');
const ExamsModel = require('../api/components/exams/model');
const NotificationsModel = require('../api/components/notifications/model');

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
  if (table === 'typesexams') {
    const typeExams = TypeExamsModel.find();
    return typeExams;
  }
  if (table === 'exams') {
    const exams = ExamsModel.find();
    return exams;
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
  const authUser = await AuthModel.findOne({ userName: username });
  const user = await UserModel.findOne({ userName: username });
  const data = { authUser, user };
  return data;
}

async function get(table, id) {
  if (table === 'typesexams') {
    const exam = TypeExamsModel.findOne({ _id: id });
    return exam;
  }
  if (table === 'exams') {
    const exam = ExamsModel.findOne({ _id: id });
    return exam;
  }
  return null;
}

async function upsert(table, data) {
  // data._id = data.id;

  if (table === 'typesexams') {
    const exist = await TypeExamsModel.findOne({ _id: data._id });
    if (exist) {
      exist.update(data, (err) => {
        if (err) console.error(err);
      });
    } else {
      const typeExam = new TypeExamsModel(data);
      typeExam.save();
    }
  }

  if (table === 'exams') {
    const exam = new ExamsModel(data);
    exam.save();
  }

  if (table === 'notifications') {
    const notifications = new NotificationsModel(data);
    notifications.save();
  }

  return null;
}

async function query(table, id) {
  if (table === 'exams') {
    if (id) {
      const exams = ExamsModel.find({ idPatient: id, deleted: false });
      return exams;
    }

    const exams = ExamsModel.find({ status: 'ordered' });
    return exams;

  }

  return null;

}

module.exports = {
  list,
  addUser,
  getUsers,
  getUser,
  updateUser,
  login,
  get,
  upsert,
  query,
};
