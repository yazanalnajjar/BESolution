/* eslint-disable no-unused-vars */
const adminModel = require("../../models/authenticate-admin.model");
const cutomerModel = require("../../models/authenticate-customer.model");
const errors = require("@feathersjs/errors");
const { encryptWithAES } = require("../../util");
exports.SignUp = class SignUp {
  async create(data) {
    if (Object.keys(data)?.length > 0) {
      if (data?.role === "admin") {
        let resultForAdmin = await checkIfExsistForAdmin(data);
        if (resultForAdmin == null) {
          if (data?.password) {
            data.password = encryptWithAES(data?.password);
          }
          return await adminModel(require("../../app")).create(data);
        } else {
          throw new errors.BadRequest("Admin Already Exists");
        }
      } else {
        if (data?.role === "customer") {
          let resultForCustomer = await checkIfExsistForCustomer(data);
          if (resultForCustomer == null) {
            if (data?.password) {
              data.password = encryptWithAES(data?.password);
            }
            return await cutomerModel(require("../../app")).create(data);
          } else {
            throw new errors.BadRequest("Customer Already Exists");
          }
        }
      }
    }
  }
};
const checkIfExsistForAdmin = async (body) => {
  let doseAdminExists = await adminModel(require("../../app")).findOne({
    email: body?.email,
    name: body?.name,
  });

  return doseAdminExists;
};
const checkIfExsistForCustomer = async (body) => {
  let result = await cutomerModel(require("../../app")).findOne({
    email: body?.email,
    name: body?.name,
  });
  return result;
};
