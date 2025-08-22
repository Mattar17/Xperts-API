const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const postController = require("../controllers/post.controller");

router.get("/", postController.getAllPosts);
router.post("/create-post", authenticate, postController.createPost);
router.patch("/update-post", authenticate, postController.updatePost);
router.delete("/delete-post", authenticate, postController.deletePost);

module.exports = router;
