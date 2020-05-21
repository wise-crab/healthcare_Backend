const bcrypt = require('bcrypt');

const TABLE = 'auth';

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require('../../../store/dummy');
  }

  async function login(username, password) {
    const data = await store.query(TABLE, { username });
    return bcrypt.compare(password, data.password)
      .then((equals) => {
        if (equals === true) {
          return true;
        }
        throw new Error('Invalid information');
      });
  }

  async function upsert(data) {
    const authData = {
      id: data.id,
    };

    if (data.username) {
      authData.username = data.username;
    }
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
