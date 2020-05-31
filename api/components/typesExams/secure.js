const auth = require('../../../auth');

module.exports = function checkAuth(action) {
  function middleware(req, res, next) {
    switch (action) {
      case 'globalSearch':
        auth.check.doctor(req);
        next();
        break;

      case 'createExam':
        auth.check.doctor(req);
        next();
        break;

      case 'updateExam':
        auth.check.doctor(req);
        next();
        break;

      default:
        next();
    }
  }

  return middleware;
};
