exports.success = (req, res, message = '', status = 200) => {
  res.status(status).send({
    error: false,
    status,
    data: message,
  });
};

exports.error = (req, res, message = 'Internal server error', status = 500) => {
  res.status(status).send({
    error: true,
    status,
    data: message,
  });
};
