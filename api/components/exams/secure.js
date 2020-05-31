const auth = require('../../../auth');

module.exports = function checkAuth(action) {
  function middleware(req, res, next) {
    switch (action) {
      case 'globalSearch':
        auth.check.doctor(req);
        next();
        break;

      case 'examSearch':
        auth.check.doctor(req);
        next();
        break;

      case 'addExam':
        auth.check.doctor(req);
        next();
        break;

      case 'staff':
        auth.check.staff(req);
        next();
        break;

      case 'public':
        auth.check.user(req);
        next();
        break;

      default:
        next();
    }
  }

  return middleware;
};
