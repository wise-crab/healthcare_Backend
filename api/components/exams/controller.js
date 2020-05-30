
const TABLE = 'exams';

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

  async function insert(body) {
    const exam = {
      idPatient: body.idPatient,
      idMedic: body.idMedic,
      registrationDate: new Date(),
      typeOfExam: body.typeOfExam,
      status: 'ordered',
      deleted: false,
    };

    return store.upsert(TABLE, exam);
  }

  return {
    list,
    get,
    insert,
  };
};
