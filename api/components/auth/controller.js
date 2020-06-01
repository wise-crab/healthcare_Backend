const bcrypt = require('bcrypt');
const { socket } = require('../../../socket');
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
    const data = await store.login(username);
    if (!data) {
      throw new Error('Invalid Information');
    }
    return bcrypt.compare(password, data.authUser.password).then((equals) => {
      if (equals === true) {
        const { authUser } = data;
        const payload = {
          userName: authUser.userName,
          rol: authUser.rol,
        };
        const token = auth.sign({ payload });
        const { user } = data;
        const response = {
          token,
          userData: {
            id: user._id,
            numberId: user.numberId,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            contactNumber: user.contactNumber,
            rol: user.rol,
          },
        };
        socket.io.emit('message', `Welcome ${user._id}`);
        return response;
      }
      throw new Error('Invalid information');
    });
  }

  async function upsert(data) {
    const authData = {
      userName: data.userName,
      rol: data.rol,
    };
    if (data.password) {
      authData.password = await bcrypt.hash(data.password, 5);
    }
    const auth = store.addUser(TABLE, authData);
    return auth;
  }

  return {
    login,
    upsert,
  };
};
