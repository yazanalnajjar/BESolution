const { Service } = require("feathers-mongoose");
const { all } = require("../../app");

exports.Complaint = class Complaint extends Service {
  async find() {
    try {
      let allComplaint = await super.Model.find().lean();
      return allComplaint;
    } catch (e) {
      throw e;
    }
  }
  async create(body) {
    return super.create(body);
  }
};
