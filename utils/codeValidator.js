const codeModel = require("../models/code.model");

const codeValidator = async function (code, userEmail) {
  const model = await codeModel.findOne({ email: userEmail }).sort({ _id: -1 });
  if (!model)
    return {
      status: "Invalid",
      statusCode: 403,
      message: "No code is requested!",
    };
  if ((model.expiresAt - new Date().getTime()) / (1000 * 60) > 15)
    return { status: "Invalid", statusCode: 403, message: "Code is expired" };
  if (code !== model.code)
    return {
      status: "Invalid",
      statusCode: 403,
      message: "Code is not correct!",
    };

  return { status: "Valid" };
};

module.exports = codeValidator;
