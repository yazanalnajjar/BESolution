const { Service } = require("feathers-mongoose");
const { customerAuth } = require("./authenticate-customer.helper");
exports.AuthenticateCustomer = class AuthenticateCustomer extends Service {
  async find(params) {
    try {
      const res = await customerAuth(params);
      return res;
    } catch (e) {
      throw e;
    }
  }

  async create(params) {
    try {
      const res = await customerAuth(params);
      return res;
    } catch (e) {
      throw e;
    }
  }
};
