const bcrypt = require('bcrypt');
const auth = require('../../../auth');

const TABLE = 'auth';

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require('../../../store/dummy');
  }

  async function login(username, password) {
    if (!username || !password) {
      throw new Error('Invalid Information');
    }
    const data = await store.query(TABLE, { username });
    if (!data) {
      throw new Error('Invalid Information');
    }
    return bcrypt.compare(password, data.password)
      .then((equals) => {
        if (equals === true) {
          const token = auth.sign({ data });
          const userRol = data.rol;
          const response = {
            token,
            userRol,
          };
          return response;
        }
        throw new Error('Invalid information');
      });
  }

  async function upsert(data) {
    const authData = {
      id: data.id,
      username: data.username,
      rol: data.rol,
    };
    if (data.password) {
      authData.password = await bcrypt.hash(data.password, 5);
    }
    return store.addUser(TABLE, authData);
  }

  return {
    login,
    upsert,
  };
};
