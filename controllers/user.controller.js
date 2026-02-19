const uploadImage = require("../utils/uploadImage");
const userModel = require("../models/user.model");
const expertApplicationModel = require("../models/expertApplication.model");
const codeValidator = require("../utils/codeValidator");

const setProfilePicture = async function (req, res) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ status: "error", message: "file is required" });

    const fileTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!fileTypes.includes(req.file.mimetype))
      return res.status(400).json({
        status: "error",
        message: "invalid file type, only jpeg, jpg and png are allowed",
      });

    const picture_url = await uploadImage.uploadImage(
      req.file.buffer,
      req.file.mimetype,
      "Xperts/user_pictures",
    );

    await userModel.updateOne(
      { email: req.currentUser.email },
      { $set: { pfp_url: picture_url } },
    );

    res.status(200).json({
      status: "success",
      message: `picture uploaded successfully`,
      data: picture_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "photo not uploaded" });
  }
};

const updateUserInfo = async function (req, res) {
  try {
    if (
      (req.body.name && req.body.name.length < 4) ||
      (req.body.bio && req.body.bio.length < 10)
    )
      return res
        .status(403)
        .json({ status: "error", message: "Name or Bio is too short" });

    const updatedInfo = {};
    if (req.body.name !== undefined) updatedInfo.name = req.body.name;
    if (req.body.bio !== undefined) updatedInfo.bio = req.body.bio;

    const updatedUser = await userModel
      .findByIdAndUpdate(req.currentUser._id, updatedInfo, {
        new: true,
        runValidators: true,
      })
      .select("name bio");
    res.status(200).json({
      status: "success",
      message: "User info is updated",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error happened please try again (Update user error)!!",
    });
  }
};

const resetPassword = async function (req, res) {
  try {
    const codeValidatorResult = await codeValidator(
      req.body.code,
      req.currentUser.email,
    );

    if (codeValidatorResult.status === "Invalid")
      return res
        .status(codeValidatorResult.statusCode)
        .json({ status: "error", message: codeValidatorResult.message });

    const user = await userModel.findById(req.currentUser._id);
    if (user.password === req.body.newPassword)
      res
        .status(403)
        .json({ status: "error", message: "You can't enter the old password" });

    await user.updateOne({ $set: { password: req.body.newPassword } });

    res.status(200).json({ status: "success", message: "password Changed" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Try Again!!" });
  }
};

const applyAsExpert = async function (req, res) {
  try {
    console.log(req.files.length);
    if (req.files.length < 1)
      return res
        .status(403)
        .json({ status: "error", message: "Upload at least one file" });

    if (!req.body.category || req.body.category === "") {
      return res.status(403).json({
        status: "error",
        message: "category Field cannot be left empty",
      });
    }

    // upload files to cloudinary + add their links to array
    const documentLinks = await Promise.all(
      req.files.map((f) =>
        uploadImage.uploadImage(f.buffer, f.mimetype, "Xperts/documents"),
      ),
    );

    const user = await userModel.findById(req.currentUser._id);
    await expertApplicationModel.insertOne({
      applicant: user,
      documents: documentLinks,
      category: req.body.category,
    });

    return res
      .status(200)
      .json({ status: "success", documents: documentLinks });
  } catch (error) {
    if (error.name === "ValidationError")
      res.status(403).json({ status: "error", message: error.message });
    res
      .status(500)
      .json({ status: "error", message: "Error Happened in server" });
  }
};

const searchForUser = async function (req, res) {
  const user = await userModel.find({
    name: { $regex: new RegExp(`^${req.query.name}`) },
  });
  if (!user || user.length === 0)
    return res.json({ status: "error", message: "no user found" });
  return res.status(200).json({ status: "success", data: user });
};

const viewUserProfile = async function (req, res) {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select("-password -_id -__v");
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    return res.status(200).json({ status: "success", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error Happened in server" });
  }
};

module.exports = {
  setProfilePicture,
  updateUserInfo,
  resetPassword,
  applyAsExpert,
  searchForUser,
  viewUserProfile,
};
