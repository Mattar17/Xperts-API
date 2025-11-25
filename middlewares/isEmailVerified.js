const isEmailVerified = function (req, res, next) {
  if (!req.currentUser.isEmailVerified)
    return res
      .status(403)
      .json({ status: "error", message: "you Email is not verified" });

  next();
};

module.exports = isEmailVerified;
