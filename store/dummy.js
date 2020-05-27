const db = {
  'users': [
    {
      id: '1',
      numberId: 1018071456,
      name: 'Pedro',
      lastName: 'Goméz',
      email: 'pedro@gmail.com',
      phone: 314685940,
      username: 'luis.parra.1661',
      rol: 'admin',
      deleted: false,
    },
    {
      id: '2',
      numberId: 2021561,
      name: 'Juan',
      lastName: 'Rodriguez',
      email: 'juan@gmail.com',
      phone: 315685940,
      username: 'juanito',
      rol: 'medic',
      deleted: false,
    },
    {
      id: '3',
      numberId: 6465161,
      name: 'Andres',
      lastName: 'Suarez',
      email: 'andres@gmail.com',
      phone: 316585940,
      username: 'andreses',
      rol: 'bacteriologist',
      deleted: false,
    },
    {
      id: '4',
      numberId: 85461654,
      name: 'Paula',
      lastName: 'Silva',
      email: 'paula@gmail.com',
      phone: 3154549216,
      username: 'paulaaa',
      rol: 'patient',
      deleted: false,
    },
    {
      id: '6',
      numberId: 54651564,
      name: 'Raul',
      lastName: 'Silva',
      email: 'raul@gmail.com',
      phone: 3154549216,
      username: 'raulll',
      rol: 'medic',
      deleted: false,
    },
    {
      id: 'y_8-e_lXKGTff8MxcTbPb',
      numberId: 1019071661,
      name: 'luis',
      lastName: 'parra',
      email: 'luis@gmail.com',
      phone: '3145888791',
      rol: 'admin',
      deleted: false,
      username: 'luis.parra.1564',
    },
  ],
  'auth': [
    {
      id: 'y_8-e_lXKGTff8MxcTbPb',
      username: 'luis.parra.1564',
      rol: 'admin',
      password: '$2b$05$QS1ByFFrv5N77QJTUkF9kO8jW5k5ezzUu/3PkmsGICv7IPVGr4FWy',
    },
  ],
};

async function list(table) {
  return db[table] || [];
}

async function getUsers(filterUsers, table = 'users') {
  const col = await list(table);
  const result = col.filter((item) => item.rol === filterUsers);
  return result;
}

async function getUser(data = 'document', numberId, table = 'users') {
  const col = await list(table);
  return col.filter((item) => item.numberId === numberId) || null;
}

async function addUser(user, table = 'users') {
  if (!db[table]) {
    db[table] = [];
  }
  db[table].push(user);
}

async function updateUser(document, data) {
  const user = await getUser(document);

  user.numberId = data.numberId;
  user.name = data.name;
  user.lastName = data.lastName;
  user.email = data.email;
  user.phone = data.phone;
  user.rol = data.rol;
  user.deleted = data.deleted;

  return true;
}

async function query(q, table = 'users') {
  const col = await list(table);
  const keys = Object.keys(q);
  const key = keys[0];

  return col.filter((item) => item[key] === q[key])[0] || null;
}

module.exports = {
  list,
  getUsers,
  getUser,
  addUser,
  updateUser,
  query,
};
