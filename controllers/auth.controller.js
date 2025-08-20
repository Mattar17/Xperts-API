const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/emailSender");
const codeModel = require("../models/code.model");

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(403).json("email and password are required");
    }
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json("user not found");
    }
    if (password !== user.password) {
      return res.status(404).json("wrong email or password");
    }

    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified,
      },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "2d" }
    );
    return res.status(200).json({ status: "success", token });
  } catch (error) {
    return res.status(500).json("Error Happened");
  }
};

const Register = async (req, res) => {
  if (await userModel.findOne({ email: req.body.email }))
    res.status(403).json("email already exists");

  try {
    const newUser = req.body;
    await userModel.insertOne(newUser);
    res.status(200).json({ status: "success", data: newUser });
  } catch (error) {
    res.status(500).json("Error Happened!!!!");
  }
};

const sendVerificationCode = async (req, res) => {
  try {
    await mailSender(req.currentUser.email);
    res.status(200).json("Code sent");
  } catch (error) {
    res.status(500).json("please try again");
  }
};

const verifyEmail = async (req, res) => {
  try {
    const model = await codeModel
      .findOne({ email: req.currentUser.email })
      .sort({ _id: -1 });
    if (!model) res.status(403).json("No code is requested!");

    if ((model.expiresAt - new Date().getTime()) / (1000 * 60) > 15)
      res.status(403).json("Code is expired");
    if (req.body.code !== model.code)
      res.status(403).json("Code is not correct!");

    await userModel
      .findOne({ email: req.currentUser.email })
      .updateOne({ isEmailVerified: true });
    res.status(200).json("Email is verified Successfully");
  } catch (error) {
    res.status(500).json("Error Happened! please try again");
  }
};

module.exports = {
  Login,
  Register,
  verifyEmail,
  sendVerificationCode,
  verifyEmail,
};
