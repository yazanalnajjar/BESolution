const feathers = require("@feathersjs/feathers");
const configuration = require("@feathersjs/configuration");
const express = require("@feathersjs/express");
const app = express(feathers());
app.configure(configuration());

module.exports = {
  adminTokenConfig: app.get("adminTokenConfig"),
  customerTokenConfig: app.get("customerTokenConfig"),
  token_key: app.get("token_key"),
  baseUrl: app.get("baseUrl"),
  paginate: app.get("paginate"),
};
