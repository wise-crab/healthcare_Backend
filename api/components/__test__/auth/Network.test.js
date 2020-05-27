
const testServer = require('../../__mocks__/testserver');

describe('routes - auth', () => {
  const network = require('../../auth/network');
  const request = testServer(network);
  describe('POST /login', () => {
    test('should respond with status 401', (done) => {
      request.post('/login').expect(401, done);
    });
  });
});

