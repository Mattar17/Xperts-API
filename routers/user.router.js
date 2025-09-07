const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const uploadFile = require("../utils/uploadImage");
const authenticate = require("../middlewares/authenticate");

router.patch(
  "/set-profile-picture",
  authenticate,
  uploadFile.upload.single("picture"),
  userController.setProfilePicture
);
router.patch("/change-name", authenticate, userController.changeName);
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
