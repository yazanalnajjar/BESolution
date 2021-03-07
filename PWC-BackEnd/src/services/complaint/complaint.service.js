// Initializes the `complaint` service on path `/complaint`
const { Complaint } = require('./complaint.class');
const createModel = require('../../models/complaint.model');
const hooks = require('./complaint.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/complaint', new Complaint(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('complaint');

  service.hooks(hooks);
};
