// Initializes the `authenticate-customer` service on path `/authenticate-customer`
const { AuthenticateCustomer } = require('./authenticate-customer.class');
const createModel = require('../../models/authenticate-customer.model');
const hooks = require('./authenticate-customer.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/authenticate-customer', new AuthenticateCustomer(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('authenticate-customer');

  service.hooks(hooks);
};
