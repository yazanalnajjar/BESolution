const customerModel = require("../../models/authenticate-customer.model");
const DEFAULT = require("../../default");
const { HandleError, create_token, decryptWithAES } = require("../../util");
const customerAuth = async (params) => {
  try {
    const Query = {
      email: params["email"],
    };

    const user = await customerModel(require("../../app"))
      .findOne(Query)
      .lean();

    if (user == null) {
      HandleError("NotAuthenticated", "Invalid Credentials Need To Sign Up");
    }

    const userDecryptPass = await decryptWithAES(user.password);
    if (userDecryptPass === params["password"]) {
      const response = createCustomerAuthResponse(user, false);
      return response;
    } else {
      HandleError("NotAuthenticated", "Invalid Credentials");
    }
  } catch (e) {
    throw e;
  }
};
exports.customerAuth = customerAuth;
const createCustomerAuthResponse = async (user) => {
  try {
    let token = create_token(
      {
        username: user.username,
        name: user.name,
        scope: "customer",
        id: user._id,
      },
      DEFAULT.customerTokenConfig
    );

    return {
      access_token: token,
      name: user.name,
      customer: user._id,
      role: "customer",
      login_status: "success",
    };
  } catch (e) {
    throw e;
  }
};
