// Application hooks that run for every service
const { setNow } = require('feathers-hooks-common');

module.exports = {
  before: {
    all:    [],
    find:   [],
    get:    [],
    create: [setNow('createdAt', 'updatedAt')],
    update: [setNow('updatedAt')],
    patch:  [setNow('updatedAt')],
    remove: []
  },

  after: {
    all:    [],
    find:   [],
    get:    [],
    create: [],
    update: [],
    patch:  [],
    remove: []
  },

  error: {
    all:    [],
    find:   [],
    get:    [],
    create: [],
    update: [],
    patch:  [],
    remove: []
  }
};
