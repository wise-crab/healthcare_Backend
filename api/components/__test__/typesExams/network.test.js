const testServer = require('../../__mocks__/testserver');
const { doctor } = require('../../__mocks__/jwtMock');

describe('routes - TypeExams', () => {
  const network = require('../../typesExams/network');
  const request = testServer(network);
  describe('GET /types-exams', () => {
    test('should respond with status 200', (done) => {
      request.get('/types-exams').auth(doctor, { type: 'bearer' }).expect(200, done);
    });
  });
  describe('GET /types-exams with query', () => {
    test('should respond with status 200', (done) => {
      request
        .get('/types-exams')
        .query({ id: '1' })
        .auth(doctor, { type: 'bearer' })
        .expect(200, done);
    });
  });
  describe('POST /types-exams', () => {
    test('should respond with status 200', (done) => {
      request
        .post('/types-exams')
        .send({
          name: 'head',
        })
        .auth(doctor, { type: 'bearer' })
        .expect(201, done);
    });
  });
  describe('PUT /types-exams', () => {
    test('should respond with status 200', (done) => {
      request
        .put('/types-exams')
        .send({
          _id: '3',
        })
        .auth(doctor, { type: 'bearer' })
        .expect(201, done);
    });
  });
});
