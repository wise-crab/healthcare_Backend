
const TABLE = 'typesexams';

const ObjectId = require('mongodb').ObjectID;

module.exports = (injectedStore) => {
  let store = injectedStore;

  if (!store) {
    store = require('../../../store/dummy');
  }

  async function list() {
    const typesExams = await store.list(TABLE);
    return typesExams;
  }

  async function get(id) {
    const typeExam = await store.get(TABLE, id);
    return typeExam;
  }

  async function upsert(body) {
    const datetime = new Date();
    const typeExam = {
      name: body.name,
      registrationDate: new Date(),
    };

    if (body._id) {
      typeExam._id = body._id;
      typeExam.deleted = body.deleted;
    } else {
      typeExam.deleted = false;
      typeExam._id = new ObjectId();
    }

    return store.upsert(TABLE, typeExam);
  }

  return {
    list,
    get,
    upsert,
  };
};
