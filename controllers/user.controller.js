const uploadImage = require("../utils/uploadImage");
const userModel = require("../models/user.model");
const codeModel = require("../models/code.model");

const setProfilePicture = async function (req, res) {
  try {
    if (!req.file) res.json("file is required");

    const picture_url = await uploadImage.uploadImage(
      req.file.buffer,
      req.file.mimetype
    );

    await userModel.updateOne(
      { email: req.currentUser.email },
      { $set: { pfp_url: picture_url } }
    );

    res.status(200).json(`picture uploaded successfully url:${picture_url}`);
  } catch (error) {
    console.log(error);
    res.json("photo not uploaded");
  }
};

const changeName = async function (req, res) {
  try {
    if (req.body.newName.length < 4) res.status(403).json("name is too short");
    await userModel.updateOne(
      { email: req.currentUser.email },
      { $set: { name: req.body.newName } }
    );
    res.status(200).json("Name is updated");
  } catch (error) {
    res.status(500).json("Error happened please try again!!");
  }
};

const resetPassword = async function (req, res) {
  try {
    const model = await codeModel
      .findOne({ email: req.currentUser.email })
      .sort({ _id: -1 });
    if (!model) res.status(403).json("No code is requested!");
    if ((model.expiresAt - new Date().getTime()) / (1000 * 60) > 15)
      res.status(403).json("Code is expired");
    if (req.body.code !== model.code)
      res.status(403).json("Code is not correct!");
    const user = await userModel.findOne({ email: req.currentUser.email });

    if (user.password === req.body.newPassword)
      res.status(403).json("You can't enter the old password");

    await user.updateOne({ $set: { password: req.body.newPassword } });

    res.status(200).json("password Changed");
  } catch (error) {
    res.status(500).json("Try Again!!");
  }
};

module.exports = {
  setProfilePicture,
  changeName,
  resetPassword,
};
