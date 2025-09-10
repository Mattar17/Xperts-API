const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/emailSender");
const codeModel = require("../models/code.model");
const generateToken = require("../services/tokenGenerator");

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(403)
        .json({ status: "error", message: "email and password are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "user not found" });
    }
    if (password !== user.password) {
      return res
        .status(404)
        .json({ status: "error", message: "wrong email or password" });
    }

    const token = generateToken(user);
    return res.status(200).json({ status: "success", token });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server Error" });
  }
};

const Register = async (req, res) => {
  if (await userModel.findOne({ email: req.body.email }))
    res.status(403).json({ status: "error", message: "email already exists" });

  try {
    const newUser = req.body;
    await userModel.insertOne(newUser);
    res.status(200).json({ status: "success", data: newUser });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server Error" });
  }
};

const sendVerificationCode = async (req, res) => {
  try {
    await mailSender(req.currentUser.email);
    res.status(200).json({ status: "success", message: "Code sent" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "please try again" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const model = await codeModel
      .findOne({ email: req.currentUser.email })
      .sort({ _id: -1 });
    if (!model)
      res
        .status(403)
        .json({ status: "error", message: "No code is requested!" });

    if ((model.expiresAt - new Date().getTime()) / (1000 * 60) > 15)
      res.status(403).json({ status: "error", message: "Code is expired" });
    if (req.body.code !== model.code)
      res
        .status(403)
        .json({ status: "error", message: "Code is not correct!" });

    await userModel
      .findOne({ email: req.currentUser.email })
      .updateOne({ isEmailVerified: true });
    res
      .status(200)
      .json({ status: "success", message: "Email is verified Successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server Error" });
  }
};

module.exports = {
  Login,
  Register,
  verifyEmail,
  sendVerificationCode,
  verifyEmail,
};
