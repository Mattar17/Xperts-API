const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const isEmailVerified = require("../middlewares/isEmailVerified");
const postController = require("../controllers/post.controller");

router.get("/", postController.getAllPosts);
router.post(
  "/create-post",
  authenticate,
  isEmailVerified,
  postController.createPost
);
router.patch(
  "/update-post",
  authenticate,
  isEmailVerified,
  postController.updatePost
);
router.delete(
  "/delete-post",
  authenticate,
  isEmailVerified,
  postController.deletePost
);

module.exports = router;
