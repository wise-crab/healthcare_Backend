const controller = require('../../auth/controller');
const store = require('../../../../store/dummy');

const Controller = controller(store);

const data = {
  userName: 'luis.parra.1564',
  rol: 'admin',
  password: 'secret',
};

describe('controller - auth', () => {
  test('should return token', async () => {
    return Controller.login('luis.parra.1564', 'secret').then((user) => {
      expect(user).toBeTruthy();
    });
  });

  test('should return true', async () => {
    return Controller.upsert(data).then((user) => {
      expect(user).toBeTruthy();
    });
  });
});
