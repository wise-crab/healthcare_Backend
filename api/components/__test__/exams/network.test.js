const testServer = require('../../__mocks__/testserver');
const { doctor } = require('../../__mocks__/jwtMock');
const { bacteriologist } = require('../../__mocks__/jwtMock');

describe('routes - exams', () => {
  const network = require('../../exams/network');
  const request = testServer(network);
  describe('GET /exams', () => {
    test('should respond with status 200', (done) => {
      request.get('/exams').auth(doctor, { type: 'bearer' }).expect(200, done);
    });
  });
  describe('GET /exams with query', () => {
    test('should respond with status 200', (done) => {
      request
        .get('/exams')
        .query({ id: '1' })
        .auth(doctor, { type: 'bearer' })
        .expect(200, done);
    });
  });
  describe('GET /exams-query', () => {
    test('should respond with status 200', (done) => {
      request
        .get('/exams-query')
        .query({ id: '1' })
        .auth(bacteriologist, { type: 'bearer' })
        .expect(200, done);
    });
  });
  describe('POST /exams', () => {
    test('should respond with status 200', (done) => {
      request
        .post('/exams')
        .send({
          idPatient: '1',
          idDoctor: '2',
          typeOfExam: 'head',
        })
        .auth(doctor, { type: 'bearer' })
        .expect(201, done);
    });
  });
  describe('PUT /exams', () => {
    test('should respond with status 200', (done) => {
      request
        .put('/exams')
        .send({
          _id: '3',
          idPatient: '1',
          idDoctor: '2',
          registrationDate: '2020-05-30T15:19:04.042Z',
          typeOfExam: 'head',
          status: 'pending',
          deleted: false,
        })
        .auth(doctor, { type: 'bearer' })
        .expect(201, done);
    });
  });
});
