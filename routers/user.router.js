const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const uploadFile = require("../utils/uploadImage");
const authenticate = require("../middlewares/authenticate");

router.post(
  "/set-profile-picture",
  authenticate,
  uploadFile.upload.single("picture"),
  userController.setProfilePicture
);

module.exports = router;
