const typesExamMock = require('../../__mocks__/typesExamMock');
const controller = require('../../typesExams/controller');
const store = require('../../../../store/dummy');

const Controller = controller(store);

describe('controller - types-exams', () => {
  test('should return list of types-exams', async () => {
    return Controller.list().then((exam) => {
      expect(exam).toStrictEqual(typesExamMock);
    });
  });
  test('should return an type-exam', async () => {
    return Controller.get({ id: '1' }).then((exam) => {
      expect(exam).toStrictEqual([typesExamMock[0]]);
    });
  });
  test('should add a type-exam', async () => {
    return Controller.upsert({ name: 'head' }).then((exam) => {
      expect(exam).toStrictEqual({
        id: '2',
        name: 'head',
        registrationDate: 'today',
        deleted: false,
      });
    });
  });
});
