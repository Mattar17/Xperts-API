const jwt = require("jsonwebtoken");

const authenticate = function (req, res, next) {
  const header = req.headers["Authentication"] || req.headers["authentication"];
  if (!header) res.json({ status: "error", message: "token is required" });
  const token = header.split(" ")[1];
  const tokenEncoding = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
  req.currentUser = tokenEncoding;
  next();
};

module.exports = authenticate;
