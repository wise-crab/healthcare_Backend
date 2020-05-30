const TABLE = 'exams';

const ObjectId = require('mongodb').ObjectID;

module.exports = (injectedStore) => {
  let store = injectedStore;

  if (!store) {
    store = require('../../../store/dummy');
  }

  async function list() {
    const exams = await store.list(TABLE);
    return exams;
  }

  async function get(id) {
    const exam = await store.get(TABLE, id);
    return exam;
  }

  async function upsert(body) {
    const exam = {
      name: body.name,
      registrationDate: new Date(),
    };

    if (body._id) {
      exam._id = body._id;
      exam.deleted = body.deleted;
    } else {
      exam.deleted = false;
      exam._id = new ObjectId();
    }

    return store.upsert(TABLE, exam);
  }

  return {
    list,
    get,
    upsert,
  };
};
