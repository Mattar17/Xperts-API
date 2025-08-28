const adminOnly = function (req, res, next) {
  if (req.currentUser.isAdmin) next();

  return res
    .status(401)
    .json({ status: "fail", message: "you're not authorized" });
};

module.exports = adminOnly;
