const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const isEmailVerified = require("../middlewares/isEmailVerified");
const postController = require("../controllers/post.controller");
const commentController = require("../controllers/comment.controller");

router.get("/", postController.getAllPosts);
router.post("/", authenticate, isEmailVerified, postController.createPost);
router.patch("/:id", authenticate, isEmailVerified, postController.updatePost);
router.delete("/:id", authenticate, isEmailVerified, postController.deletePost);

router.get("/:post_id/comments", commentController.getComments);
router.post(
  "/:post_id/comments",
  authenticate,
  commentController.createComment,
);
router.patch(
  "/:post_id/comments/:comment_id",
  authenticate,
  commentController.updateComment,
);
router.delete(
  "/:post_id/comments/:comment_id",
  authenticate,
  commentController.deleteComment,
);

module.exports = router;
