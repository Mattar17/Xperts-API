const userModel = require("../models/user.model");
const mailSender = require("../utils/emailSender");
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
    console.log("!!!!!!!!");
    const codeValidatorResult = await codeValidator(
      req.body.code,
      req.currentUser.email
    );

    console.log("!!!!!!");

    if (codeValidatorResult.status === "Invalid")
      return res
        .status(codeValidatorResult.statusCode)
        .json({ status: "error", message: codeValidatorResult.message });
    console.log("!!!!!!!!!!!");
    await userModel
      .findByIdAndUpdate(req.currentUser._id, { isEmailVerified: true })
      .exec();
    console.log(req.currentUser);
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
