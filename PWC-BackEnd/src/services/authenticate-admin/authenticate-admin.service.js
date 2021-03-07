// Initializes the `authenticate-admin` service on path `/authenticate-admin`
const { AuthenticateAdmin } = require('./authenticate-admin.class');
const createModel = require('../../models/authenticate-admin.model');
const hooks = require('./authenticate-admin.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/authenticate-admin', new AuthenticateAdmin(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('authenticate-admin');

  service.hooks(hooks);
};
