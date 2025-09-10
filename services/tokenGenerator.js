const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
    },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: "2d" }
  );
};

module.exports = generateToken;
