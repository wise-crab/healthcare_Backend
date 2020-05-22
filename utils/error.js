function error(message, code) {
  const e = new Error(message);
  if (code) {
    e.statusCode = code;
  }

  return e;
}

module.exports = error;
