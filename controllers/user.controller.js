const uploadImage = require("../utils/uploadImage");
const userModel = require("../models/user.model");
const codeModel = require("../models/code.model");
const expertApplicationModel = require("../models/expertApplication.model");

const setProfilePicture = async function (req, res) {
  try {
    if (!req.file) res.json("file is required");

    const picture_url = await uploadImage.uploadImage(
      req.file.buffer,
      req.file.mimetype,
      "Xperts/user_pictures"
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

const applyAsExpert = async function (req, res) {
  try {
    console.log(req.files.length);
    if (req.files.length < 1)
      return res
        .status(403)
        .json({ status: "FAIL", Error: "Upload at least one file" });

    if (!req.body.field || req.body.field === "") {
      return res.status(403).json("Field cannot be left empty");
    }

    // upload files to cloudinary + add their links to array
    const documentLinks = await Promise.all(
      req.files.map((f) =>
        uploadImage.uploadImage(f.buffer, f.mimetype, "Xperts/documents")
      )
    );

    const user = await userModel.findOne({ email: req.currentUser.email });
    await expertApplicationModel.insertOne({
      applicant: user,
      documents: documentLinks,
      fields: req.body.field,
    });

    return res
      .status(200)
      .json({ status: "SUCCESS", documents: documentLinks });
  } catch (error) {
    if (error.name === "ValidationError") res.status(403).json(error.message);
    res.status(500).json("Error Happened in server");
  }
};

module.exports = {
  setProfilePicture,
  changeName,
  resetPassword,
  applyAsExpert,
};
