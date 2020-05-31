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

  async function upsert(body) {
    const exam = {
      idPatient: body.idPatient,
      idMedic: body.idDoctor,
      registrationDate: new Date(),
      typeOfExam: body.typeOfExam,
      status: 'pending',
      deleted: false,
    };

    if (body._id) {
      exam._id = body._id;
      exam.idBacteriologist = body.idBacteriologist;
      exam.status = body.status;
    }

    return store.upsert(TABLE, exam);
  }

  async function query(user, id) {
    if (user === 'patient') {
      const exams = await store.query(TABLE, id);
      return exams;
    }
    if (user === 'bacteriologist') {
      const exams = await store.query(TABLE);
      return exams;
    }
  }

  return {
    list,
    get,
    upsert,
    query,
  };
};
