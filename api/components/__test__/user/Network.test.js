const testServer = require('../../__mocks__/testserver');

describe('routes - users', () => {
  const network = require('../../user/network');
  const request = testServer(network);
  describe('GET /users', () => {
    test('should respond with status 401', (done) => {
      request.get('/users').expect(401, done);
    });
  });
});

