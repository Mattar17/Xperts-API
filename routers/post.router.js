const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const isEmailVerified = require("../middlewares/isEmailVerified");
const postController = require("../controllers/post.controller");
const commentController = require("../controllers/comment.controller");

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
router.get("/comments", commentController.getComments);
router.post("/comments", authenticate, commentController.createComment);
router.patch("/comments", authenticate, commentController.updateComment);
router.delete("/comments", authenticate, commentController.deleteComment);

module.exports = router;
