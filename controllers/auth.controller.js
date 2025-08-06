const userModel = require("../models/user.model");

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
    return res.status(200).json({ status: "success", data: user });
  } catch (error) {
    return res.status(500).json("Error Happened");
  }
};

const Register = async (req, res) => {
  if (await userModel.findOne({ email: req.body.email }))
    res.status(403).json("email already exists");

  try {
    const newUser = req.body;
    console.log(newUser);
    await userModel.insertOne(newUser);
    res.status(200).json({ status: "success", data: newUser });
  } catch (error) {
    res.status(500).json("Error Happened!!!!");
  }
};

module.exports = {
  Login,
  Register,
};
