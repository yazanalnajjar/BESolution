// Initializes the `signUp` service on path `/sign-up`
const { SignUp } = require('./sign-up.class');
const hooks = require('./sign-up.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/sign-up', new SignUp(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sign-up');

  service.hooks(hooks);
};
