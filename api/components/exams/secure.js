const auth = require('../../../auth');

module.exports = function checkAuth(action) {
  function middleware(req, res, next) {
    switch (action) {
      case 'globalSearch':
        auth.check.admin(req);
        next();
        break;

      case 'rolSearch':
        auth.check.rol(req);
        next();
        break;

      case 'createUser':
        auth.check.admin(req);
        next();
        break;

      case 'updateUser':
        auth.check.admin(req);
        next();
        break;

      case 'deletedUser':
        auth.check.admin(req);
        next();
        break;

      case 'userSearch':
        auth.check.rol(req);
        next();
        break;

      default:
        next();
    }
  }

  return middleware;
};
