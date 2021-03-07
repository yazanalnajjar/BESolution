const authenticateAdmin = require("./authenticate-admin/authenticate-admin.service.js");
const authenticateCustomer = require("./authenticate-customer/authenticate-customer.service.js");
const signUp = require('./sign-up/sign-up.service.js');
const complaint = require('./complaint/complaint.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(authenticateAdmin);
  app.configure(authenticateCustomer);
  app.configure(signUp);
  app.configure(complaint);
};
