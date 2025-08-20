const uploadImage = require("../utils/uploadImage");
const userModel = require("../models/user.model");

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

module.exports = {
  setProfilePicture,
};
