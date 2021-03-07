const errors = require("@feathersjs/errors");
const DEFAULT = require("./default");
const oId = /^[a-f\d]{24}$/i;
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
exports.getQuery = (params, listOfAcceptedKeys) => {
  params = JSON.parse(JSON.stringify(params));

  const query = {};
  for (var key of Object.keys(params.query)) {
    if (listOfAcceptedKeys.includes(key) || key === "search") {
      try {
        if (key === "disabled") {
          query.disabled = params.query.disabled
            ? params.query.disabled
            : false;
        } else if (key === "search") {
          try {
            query.name = {
              $regex: params.query.search,
              $options: "i",
            };
          } catch (e) {
            console.log("Error in searching");
            console.log(e);
          }
        } else {
          query[key] = {
            $in: parseArray(params.query[key]),
          };
        }
      } catch (e) {
        console.error(e);
        return e;
      }
    } else {
      // throw new errors.MethodNotAllowed("CHECK if it's exists", "sdfadsfsadfd");
    }
  }
  //   adaptQueryForRepzoScope(query, params);
  return query;
};

exports.create_token = (userData, tokenConfig) => {
  try {
    return jwt.sign(userData, DEFAULT.token_key, tokenConfig);
  } catch (e) {
    throw e;
  }
};
exports.urlBuilder = (baseUrl, page, query) => {
  query.page = page;
  Object.assign(query, page);
  let queryArray = [];
  Object.keys(query).forEach((k) => {
    const val = query[k];
    if (val) {
      queryArray.push(`${k}=${val}`);
    }
  });
  const queryString = queryArray.join("&");

  return `${baseUrl}?${queryString}`;
};

function parseArray(p) {
  var newResult;
  let result;
  try {
    result = JSON.parse(p);
  } catch (e) {
    result = p;
  }
  if (Array.isArray(result)) {
    newResult = result.map((id) => {
      return parseId(id);
    });
    return newResult;
  } else {
    result = [result];
    newResult = result.map((id) => {
      return parseId(id);
    });
    return newResult;
  }
}
exports.parseArray = parseArray;

function parseId(id) {
  if (oId.test(id)) {
    try {
      var newID = mongoose.Types.ObjectId(id);
      return newID;
    } catch (e) {
      return id;
    }
  }
  return id;
}

exports.paginationAdapterSV = (result, options, query, _path, total) => {
  query.per_page = options.limit;
  const currentPage = options["page"];
  const totalPages = Math.ceil(total / options.limit);
  const response = {
    total_result: total,
    current_count: result.length ? result.length : 0,
    total_pages: totalPages,
    current_page: options.page,
    per_page: options.limit,
    first_page_url: this.urlBuilder(_path, 1, query),
    last_page_url: this.urlBuilder(_path, totalPages, query),
    next_page_url: null,
    prev_page_url: null,
    path: _path,
    data: result,
  };

  if (currentPage <= totalPages) {
    (response.next_page_url = this.urlBuilder(
      _path,
      options.page + 1 < totalPages ? options.page + 1 : totalPages,
      query
    )),
      (response.prev_page_url = this.urlBuilder(
        _path,
        options.page - 1 > 1 ? options.page - 1 : 1,
        query
      ));
  }

  response.next_page_url = encodeURI(response.next_page_url);
  response.prev_page_url = encodeURI(response.prev_page_url);
  response.first_page_url = encodeURI(response.first_page_url);
  response.last_page_url = encodeURI(response.last_page_url);

  if (
    response.current_page == response.total_pages ||
    response.total_pages == 0
  ) {
    response.next_page_url = null;
  }

  if (response.current_page == 1) {
    response.prev_page_url = null;
  }

  return response;
};

exports.getOptions = (DEFAULT, UserRequest) => {
  try {
    const paginate = DEFAULT.paginate;
    let per_page = parseInt(UserRequest.per_page)
      ? parseInt(UserRequest.per_page)
      : paginate.default;
    let page = parseInt(UserRequest.page) ? parseInt(UserRequest.page) : 1;
    let sortBy = UserRequest.sort ? UserRequest.sort : "_id";
    if (per_page > paginate.max) {
      per_page = paginate.max;
    }
    let options = {
      skip: (page - 1) * per_page,
      limit: per_page,
      page: page,
      sort: {},
    };
    // if (UserRequest.export && UserRequest.export == "excel") {
    //   checkDurationsValidate(UserRequest);
    //   delete options.skip;
    //   delete options.limit;
    // }
    options.sort[sortBy] = -1;
    return options;
  } catch (e) {
    throw e;
  }
};

exports.checkIfCompanyNameSpaceExistsInPostRequest = (body) => {
  if (!body?.company_namespace)
    throw new errors.BadRequest("Company_namespace Should Be Exists");
};

exports.HandleError = (typeOfError, errorMessage) => {
  switch (typeOfError) {
    case "BadRequest":
      throw new errors.BadRequest(errorMessage);
    case "NotAuthenticated":
      throw new errors.NotAuthenticated(errorMessage);
    case "PaymentError":
      throw new errors.PaymentError(errorMessage);
    case "NotFound":
      throw new errors.NotFound(errorMessage);
    case "MethodNotAllowed":
      throw new errors.MethodNotAllowed(errorMessage);
    case "NotAcceptable":
      throw new errors.NotAcceptable(errorMessage);
    case "Timeout":
      throw new errors.Timeout(errorMessage);
    case "Conflict":
      throw new errors.Conflict(errorMessage);
    default:
      console.log("Type Of Error Not Correct Need To Fix");
      throw new errors.NotImplemented(
        "Type Of Error Not Correct Need To Fix In HandleError Function"
      );
  }
};

exports.encryptWithAES = (text) => {
  const passphrase = "My Secret Passphrase";
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

exports.decryptWithAES = (ciphertext) => {
  const passphrase = "My Secret Passphrase";
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

const scorePassword = (pass) => {
  var score = 0;
  if (!pass) return score;

  // award every unique letter until 5 repetitions
  var letters = new Object();
  for (var i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1;
    score += 5.0 / letters[pass[i]];
  }

  // bonus points for mixing it up
  var variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass),
  };

  variationCount = 0;
  for (var check in variations) {
    variationCount += variations[check] == true ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  return parseInt(score);
};

exports.checkPassStrength = (pass) => {
  if (!_.isEmpty(pass)) {
    var score = scorePassword(pass);
    if (score > 80) return "strong";
    if (score > 60) return "good";
    if (score >= 30) return "weak";

    this.HandleError("BadRequest", "Password Too Weak");
  } else {
    this.HandleError(
      "BadRequest",
      "Parameter Not Passing Through Pass Strength Func"
    );
  }
};

const isValidToken = (token) => {
  let result = { valid: false, decoded: {} };

  try {
    let config = {
      algorithms: "HS256",
    };
    const token_key = DEFAULT.token_key;
    let decoded = jwt.verify(token, token_key, config);

    if (decoded.exp < Date.now()) {
      result.valid = true;
      result.decoded = decoded;
    }

    return result;
  } catch (e) {
    return result;
  }
};

exports.getUserInfoFromToken = (token) => {
  try {
    const decoded = isValidToken(token).decoded;
    const user = {
      name: decoded?.name || decoded?.username,
      _id: decoded?.id || null,
      type: decoded?.scope,
      company_namespace: decoded?.namespace,
    };
    return user;
  } catch (e) {
    throw e;
  }
};

exports.validate = async function (request) {
  try {
    var isValid = isValidToken(request?.params?.headers?.authorization);
    if (!isValid.valid) throw new errors.NotAuthenticated();
    if (isValid.decoded.namespace) {
      request.params.team = parseArray(isValid.decoded.namespace);
    } else if (isValid.decoded.scope == "barber") {
      request.params.timezone = isValid.decoded.timezone;
      request.params.repId = isValid.decoded.id;
      request.params.user = isValid.decoded.name || isValid.decoded.username;
    }
  } catch (e) {
    throw e;
  }
};
