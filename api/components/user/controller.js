// const { nanoid } = require('nanoid');
const generator = require('generate-password');
const nodemailer = require('nodemailer');
const config = require('../../../config');
const auth = require('../auth');

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
    const usersRol = await store.getUsers(filterUsers);
    return usersRol;
  }

  async function getUser({ document, name }) {
    if (!document && !name) {
      throw new Error('Invalid data');
    } else if (document && name) {
      throw new Error('Search by document or name');
    }

    if (document) {
      const numberId = parseInt(document, 10);
      const user = await store.getUser('numberId', numberId);
      return user;
    }

    if (name) {
      const user = await store.getUser('name', name.toLowerCase());
      return user;
    }
  }

  async function addUser(body) {
    if (
      !body.numberId ||
      !body.name ||
      !body.lastName ||
      !body.email ||
      !body.contactNumber ||
      !body.rol
    ) {
      throw new Error('Invalid data');
    }
    const user = {
      numberId: body.numberId,
      name: body.name.toLowerCase(),
      lastName: body.lastName.toLowerCase(),
      email: body.email.toLowerCase(),
      contactNumber: body.contactNumber,
      rol: body.rol.toLowerCase(),
      deleted: false,
    };

    async function creatuserName() {
      const { numberId } = user;
      let numbers = numberId.toString().slice(-4);
      let userName = `${user.name}.${user.lastName}.${numbers}`;
      const users = await list();
      const userNames = [];
      users.forEach((element) => userNames.push(element.userName));
      for (let i = 0; i < userNames.length; i++) {
        if (userName === userNames[i]) {
          const random = () => Math.floor(Math.random() * 9);
          numbers = `${random()}${random()}${random()}${random()}`;
          userName = `${user.name}.${user.lastName}.${numbers}`;
          return userName;
        }
      }
      return userName;
    }

    async function sendEmail(email, userName, password) {
      const transporter = nodemailer.createTransport({
        service: `${config.email.service}`,
        auth: {
          user: `${config.email.user}`,
          pass: `${config.email.password}`,
        },
      });

      const info = await transporter.sendMail(
        {
          from: `${config.email.user}`,
          to: email,
          subject: 'Information',
          text: `
        userName: ${userName}
        password: ${password}
        `,
        },
        (error, info) => {
          if (error) {
            console.error(error);
          } else {
            process.stdout.write(`Email sent: ${info.response}\n`);
          }
        },
      );

      return info;
    }

    user.userName = await creatuserName();
    const generatePassword = generator.generate({
      length: 10,
      numbers: true,
      lowercase: true,
      uppercase: true,
    });

    sendEmail(user.email, user.userName, generatePassword).catch(console.error);

    const authId = await auth.upsert({
      userName: user.userName,
      rol: user.rol,
      password: generatePassword,
    });

    user.idAuth = authId;

    const addUser = store.addUser(TABLE, user);
    return addUser;
  }

  async function addUsersCsv(users) {
    users.forEach((element) => {
      const user = element;
      user.numberId = parseInt(user.numberId, 10);
      user.phone = parseInt(user.phone, 10);
      addUser(user);
    });
    return true;
  }

  async function update(id, data) {
    if (!id || !data) {
      throw new Error('Invalid data');
    }
    const result = await store.updateUser(id, data);
    return result;
  }

  return {
    list,
    getUsers,
    getUser,
    addUser,
    update,
    addUsersCsv,
  };
};
