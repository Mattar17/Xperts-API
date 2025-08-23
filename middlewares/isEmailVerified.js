const isEmailVerified = function (req, res, next) {
  if (!req.currentUser.isEmailVerified)
    return res.status(403).json("you Email is not verified");

  next();
};

module.exports = isEmailVerified;
