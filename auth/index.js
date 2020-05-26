const jwt = require('jsonwebtoken');
const config = require('../config');
const error = require('../utils/error');

const { secret } = config.jwt;

function sign(data) {
  return jwt.sign(data, secret, {
    expiresIn: '15m',
  });
}

function verify(token) {
  return jwt.verify(token, secret);
}

function getToken(auth) {
  if (!auth) {
    throw error('there is not token', 401);
  }

  if (auth.indexOf('Bearer ') === -1) {
    throw error('Invalid Format', 401);
  }

  const token = auth.replace('Bearer ', '');
  return token;
}

function decodeHeader(req) {
  const authorization = req.headers.authorization || '';
  const token = getToken(authorization);
  const decoded = verify(token);

  req.user = decoded;

  return decoded;
}

const check = {
  admin(req) {
    const decoded = decodeHeader(req);
    if (decoded.data.rol !== 'admin') {
      throw error('You can not do that', 401);
    }
  },
  rol(req) {
    const decoded = decodeHeader(req);
    const userRol = decoded.data.rol;
    if (userRol !== 'admin' && userRol !== 'medic' && userRol !== 'bacteriologist') {
      throw error('You can not do that', 401);
    }
  },
};

module.exports = {
  sign,
  check,
};
