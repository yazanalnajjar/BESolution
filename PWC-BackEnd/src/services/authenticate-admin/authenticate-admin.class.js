const { Service } = require("feathers-mongoose");
const { adminAuth } = require("./authenticate-admin.helper");
exports.AuthenticateAdmin = class AuthenticateAdmin extends Service {
  async find(params) {
    try {
      const res = await adminAuth(params);
      return res;
    } catch (e) {
      throw e;
    }
  }

  async create(body) {
    try {
      const res = await adminAuth(body);
      return res;
    } catch (e) {
      throw e;
    }
  }
};
