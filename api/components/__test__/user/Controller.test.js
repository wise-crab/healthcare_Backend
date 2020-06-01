const usersMock = require('../../__mocks__/userMock');
const controller = require('../../user/controller');
const store = require('../../../../store/dummy');

const Controller = controller(store);

const newUser = {
  numberId: 1018071456,
  name: 'Andrea',
  lastName: 'Lopez',
  email: 'andrealopez@gmail.com',
  contactNumber: 3145669874,
  rol: 'doctor',
};
const userResult = {
  numberId: 1018071456,
  name: 'andrea',
  lastName: 'lopez',
  email: 'andrealopez@gmail.com',
  contactNumber: 3145669874,
  rol: 'doctor',
  userName: 'andrea.lopez.1456',
  deleted: false,
};
const updateUser = {
  numberId: 1018071456,
  name: 'andrea',
  lastName: 'lopez',
  email: 'andrealopez@gmail.com',
  contactNumber: 3145669874,
  rol: 'doctor',
};

describe('controller - user', () => {
  test('should return list of user', async () => {
    return Controller.list().then((user) => {
      expect(user).toStrictEqual(usersMock);
    });
  });
  test('should return users by rol', async () => {
    return Controller.getUsers('patient').then((user) => {
      expect(user).toStrictEqual([usersMock[3]]);
    });
  });
  test('should return an user', async () => {
    return Controller.getUser({ document: '1018071456' }).then((user) => {
      expect(user).toStrictEqual([usersMock[0]]);
    });
  });
  test('should return add user', async () => {
    return Controller.addUser(newUser).then((user) => {
      expect(user).toStrictEqual(userResult);
    });
  });
  test('should return update user', async () => {
    return Controller.update('1018071456', updateUser).then((user) => {
      expect(user).toStrictEqual(updateUser);
    });
  });
});
