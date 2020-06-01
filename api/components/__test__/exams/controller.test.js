const examsMock = require('../../__mocks__/examMock');
const controller = require('../../exams/controller');
const store = require('../../../../store/dummy');

const Controller = controller(store);

describe('controller - exam', () => {
  test('should return list of exam', async () => {
    return Controller.list().then((exam) => {
      expect(exam).toStrictEqual(examsMock);
    });
  });
  test('should return an exam', async () => {
    return Controller.get('patient').then((exam) => {
      expect(exam).toStrictEqual([examsMock[0]]);
    });
  });
  test('should return an update exam', async () => {
    return Controller.upsert({
      idPatient: '1',
      idDoctor: '4',
      typeOfExam: 'head',
    }).then((exam) => {
      expect(exam).toStrictEqual({
        idPatient: '1',
        idMedic: '4',
        deleted: false,
        registrationDate: 'today',
        status: 'pending',
        typeOfExam: 'head',
      });
    });
  });
  test('should return add exam', async () => {
    return Controller.query('bacteriologist').then((exam) => {
      expect(exam).toBe(null);
    });
  });
});
