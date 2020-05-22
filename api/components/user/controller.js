const { nanoid } = require('nanoid');
const fs = require('fs').promises;
const parse = require('csv-parse/lib/sync');
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

    async function sendEmail(email, username, password) {

      const transporter = nodemailer.createTransport({
        service: `${config.email.service}`,
        auth: {
          user: `${config.email.user}`,
          pass: `${config.email.password}`,
        },
      });

      const info = await transporter.sendMail({
        from: `${config.email.user}`,
        to: email,
        subject: 'Information',
        text: `
        username: ${username}
        password: ${password}
        `,
      }, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          process.stdout.write(`Email sent: ${info.response}\n`);
        }
      });

      return info;
    }

    user.username = await creatUsername();
    const generatePassword = generator.generate({
      length: 10,
      numbers: true,
      lowercase: true,
      uppercase: true,
    });

    sendEmail(user.email, user.username, generatePassword).catch(console.error);

    await auth.upsert({
      id: user.id,
      username: user.username,
      rol: user.rol,
      password: generatePassword,
    });

    store.addUser(TABLE, user);

  }

  async function addUsersCsv(file) {
    if (!file) {
      throw new Error('There is not file');
    }
    const content = await fs.readFile(`${file.path}`);
    const records = parse(content, { columns: true });
    records.forEach((element) => {
      const user = element;
      user.numberId = parseInt(user.numberId, 10);
      user.phone = parseInt(user.phone, 10);
      addUser(user);
    });
    return true;
  }

  async function update(document, data) {
    if (!document || !data) {
      throw new Error('Invalid data');
    }
    const result = await store.updateUser(document, data, TABLE);
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
