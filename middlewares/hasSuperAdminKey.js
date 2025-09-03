const hasSuperAdminKey = function (req, res, next) {
  const superAdminKey = req.headers["superadminkey"];
  if (!superAdminKey) return res.status(401).json("You're not authorized");
  if (superAdminKey !== process.env.SUPER_ADMIN_KEY)
    return res.status(401).json("You're not authorized");

  next();
};

module.exports = hasSuperAdminKey;
