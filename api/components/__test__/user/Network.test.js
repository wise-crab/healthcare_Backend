const testServer = require('../../__mocks__/testserver');
const token = require('../../__mocks__/jwtMock');

describe('routes - users', () => {
  const network = require('../../user/network');
  const request = testServer(network);
  describe('GET /users', () => {
    test('should respond with status 200', (done) => {
      request.get('/users').auth(token, { type: 'bearer' }).expect(200, done);
    });
  });
  describe('GET /users-rol', () => {
    test('should respond with status 200', (done) => {
      request
        .get('/users-rol')
        .query({ rol: 'patient' })
        .auth(token, { type: 'bearer' })
        .expect(200, done);
    });
  });
  describe('GET /users/user', () => {
    test('should respond with status 200', (done) => {
      request
        .get('/users/user')
        .query({ document: '1515' })
        .auth(token, { type: 'bearer' })
        .expect(200, done);
    });
  });
  describe('POST /users', () => {
    test('should respond with status 200', (done) => {
      request
        .post('/users')
        .send({
          numberId: 1019065321,
          name: 'liam',
          lastName: 'Suarez',
          email: 'liam@hotmail.com',
          contactNumber: 3205248701,
          rol: 'patient',
        })
        .auth(token, { type: 'bearer' })
        .expect(201, done);
    });
  });
  describe('PUT /users', () => {
    test('should respond with status 200', (done) => {
      request
        .put('/users/:id')
        .send({
          numberId: 1019065321,
          name: 'liam',
          lastName: 'Suarez',
          email: 'liam@hotmail.com',
          contactNumber: 3205248701,
          rol: 'patient',
        })
        .auth(token, { type: 'bearer' })
        .expect(200, done);
    });
  });
  describe('POST /users', () => {
    test('should respond with status 200', (done) => {
      request
        .post('/users-csv')
        .auth(token, { type: 'bearer' })
        .expect(500, done);
    });
  });
});
