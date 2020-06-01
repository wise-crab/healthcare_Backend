
const TABLE = 'notifications';

const ObjectId = require('mongodb').ObjectID;

module.exports = (injectedStore) => {
  let store = injectedStore;

  if (!store) {
    store = require('../../../store/dummy');
  }

  async function upsert(body) {
    const notification = body;
    if (body._id) {
      notification._id = body._id;
      notification.status = false;
    } else {
      notification._id = new ObjectId();
    }

    return store.upsert(TABLE, notification);
  }

  return {
    upsert,
  };
};
