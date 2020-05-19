const { nanoid } = require('nanoid');
// const auth = require('../auth');

const TABLE = 'users';

module.exports = (injectedStore) => {
  let store = injectedStore;

  if (!store) {
    store = require('../../../store/dummy');
  }

  async function list() {
    const users = await store.list(TABLE);
    return users;
  }
  async function getUsers(filterUsers) {
    if (!filterUsers) {
      throw new Error('Invalid data');
    }
    const usersRol = await store.getUsers(TABLE, filterUsers);
    return usersRol;
  };
  async function getUser(document) {
    if (!document) {
      throw new Error('Invalid data');
    }
    const numberId = parseInt(document, 10);
    const user = await store.getUser(TABLE, numberId);
    return user;
  }

  async function addUser(body) {
    if (!body.numberId || !body.name || !body.lastName || !body.email || !body.phone || !body.rol) {
      throw new Error('Invalid data');
    }

    const user = {
      id: nanoid(),
      numberId: body.numberId,
      name: body.name,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      rol: body.rol,
      deleted: false,
    };

    async function creatUsername() {
      const { numberId } = user;
      let numbers = numberId.toString().slice(-4);
      let username = `${user.name}.${user.lastName}.${numbers}`;
      const users = await list();
      const usernames = [];
      users.forEach((element) => usernames.push(element.username));
      for (let i = 0; i < usernames.length; i++) {
        if (username === usernames[i]) {
          const random = () => Math.floor(Math.random() * (9));
          numbers = `${random()}${random()}${random()}${random()}`;
          username = `${user.name}.${user.lastName}.${numbers}`;
          return username;
        }
      }
      return username;
    }

    user.username = await creatUsername();

    store.addUser(TABLE, user);

  }

  return {
    list,
    getUsers,
    getUser,
    addUser,
  };
};
