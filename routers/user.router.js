const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const uploadFile = require("../utils/uploadImage.js");
const authenticate = require("../middlewares/authenticate.js");

router.patch(
  "/set-profile-picture",
  authenticate,
  uploadFile.upload.single("picture"),
  userController.setProfilePicture
);
router.patch("/update_user", authenticate, userController.updateUserInfo);
router.patch("/reset-password", authenticate, userController.resetPassword);
router.post(
  "/expert-application",
  authenticate,
  uploadFile.upload.array("documents", 5),
  userController.applyAsExpert
);
router.get("/", userController.searchForUser);
router.get("/profile/:id", userController.viewUserProfile);

module.exports = router;
