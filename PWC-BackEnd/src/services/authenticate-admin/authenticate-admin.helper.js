const adminModel = require("../../models/authenticate-admin.model");
const DEFAULT = require("../../default");
const errors = require("@feathersjs/errors");
const {
  HandleError,
  checkPassStrength,
  isValidToken,
  create_token,
  decryptWithAES,
  parseArray,
} = require("../../util");
const adminAuth = async (params) => {
  try {
    const Query = {
      email: params["email"],
    };

    const user = await adminModel(require("../../app")).findOne(Query).lean();

    if (!user) {
      HandleError(
        "NotAuthenticated",
        "Invalid Credentials You Need To Sign Up"
      );
    }

    const password = user.password;

    let result = checkPassStrength(password);
    if (decryptWithAES(password) != params["password"]) {
      HandleError("NotAuthenticated", "Invalid Credentials");
    }

    if (result == "strong" || result === "good") {
      const response = await createAdminAuthResponse(user, false, params);
      return response;
    } else {
      if (!isValidToken(params["password"]).valid) {
        HandleError(
          "NotAuthenticated",
          "Invalid Credentials Or Password Need To Be Strong"
        );
      }
      const response = await createAdminAuthResponse(
        nameSpace,
        user,
        false,
        params
      );
      return response;
    }
  } catch (e) {
    throw e;
  }
};
exports.adminAuth = adminAuth;

const createAdminAuthResponse = async (user, oldRefreshToken, params) => {
  try {
    let token = create_token(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        namespace: user.company_namespace,
        scope: "admin",
      },
      DEFAULT.adminTokenConfig
    );

    return {
      access_token: token,
      login_status: "success",
      name: user.name,
      admin: user._id,
      role: "admin",
      strong_password: "strong",
    };
  } catch (e) {
    throw e;
  }
};
