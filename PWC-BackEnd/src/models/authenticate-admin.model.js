// authenticate-admin-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "authenticateAdmin";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      email: {
        type: String,
        required: true,
        validate: {
          validator: (email) =>
            email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
          message: `invalid email address`,
        },
      },
      // name: {
      //   type: String,
      //   required: true,
      // },
      // phone: { type: String, default: "" },
      password: { type: String, required: true },
    },
    {
      timestamps: true,
      collection: "admins",
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
