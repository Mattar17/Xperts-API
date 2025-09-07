const adminOnly = function (req, res, next) {
  if (!req.currentUser.isAdmin)
    return res
      .status(401)
      .json({ status: "fail", message: "you're not authorized" });

  next();
};

module.exports = adminOnly;
