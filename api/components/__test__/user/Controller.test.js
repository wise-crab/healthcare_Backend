const usersMock = require('../../__mocks__/userMock');
const controller = require('../../user/controller');
const store = require('../../../../store/dummy');

const Controller = controller(store);

describe('controller - user', () => {

  test('should return list of user', async () => {
    return Controller.list()
      .then((user) => {
        expect(user).toStrictEqual(usersMock);
      });
  });
  test('should return list of user', async () => {
    return Controller.getUsers('patient')
      .then((user) => {
        expect(user).toStrictEqual([usersMock[3]]);
      });
  });
  test('should return list of user', async () => {
    return Controller.getUser({ document: '1018071456' })
      .then((user) => {
        expect(user).toStrictEqual([usersMock[0]]);
      });
  });

});
