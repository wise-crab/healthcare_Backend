const error = require('../error');

describe('Utils - error', () => {
  test('should respond with a error.message and a code', () => {
    expect(error('Internal Error', 500)).toEqual(new Error('Internal Error'));
  });
});
