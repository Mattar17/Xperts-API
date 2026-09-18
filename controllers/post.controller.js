const postModel = require("../models/post.model.js");
const commentModel = require("../models/comment.model.js");
const logger = require("../utils/logger.js");

const getAllPosts = async function (req, res) {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (+page - 1) * limit;
    const categoryFilter = req.query.filter;
    const query = categoryFilter ? { category: categoryFilter } : {};

    const posts = await postModel
      .find(query)
      .populate("author", "name pfp_url")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name pfp_url creationDate" },
      })
      .sort({ creationDate: -1 })
      .limit(limit)
      .skip(skip);

    if (!posts || posts.length === 0)
      return res.status(404).json({ status: "error", message: "no posts" });
    return res.status(200).json({ status: "success", posts });
  } catch (error) {
    logger.error("Error fetching posts: %s", error.message, { stack: error.stack });
    return res.status(500).json({
      status: "error",
      message: "Error happened while fetching posts",
    });
  }
};

const createPost = async function (req, res) {
  try {
    const post = new postModel(req.body);
    post.author = req.currentUser._id;
    await post.validate();

    await postModel.insertOne(post);

    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    logger.error("Error creating post: %s", error.message, { stack: error.stack });
    if (error.name === "ValidationError")
      return res.status(403).json({ status: "error", message: error.message });

    return res.status(500).json({ status: "error", message: "Error happened" });
  }
};

const updatePost = async function (req, res) {
  try {
    const postId = req.params?.id || req.query?._id || req.params?.post_id;
    const post = await postModel.findById(postId).populate("author");
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "post is not Found" });

    const authorEmail = post.author?.email;
    const authorId = post.author?._id
      ? post.author._id.toString()
      : post.author
      ? post.author.toString()
      : null;
    const currentUserId = req.currentUser?._id ? req.currentUser._id.toString() : "";
    const currentUserEmail = req.currentUser?.email;

    const isOwner =
      (authorEmail && currentUserEmail && authorEmail === currentUserEmail) ||
      (authorId && currentUserId && authorId === currentUserId) ||
      req.currentUser?.isAdmin;

    if (!isOwner)
      return res.status(403).json({
        status: "error",
        message: "you are not allowed to edit this post",
      });

    if (req.body.title !== undefined) post.title = req.body.title;
    if (req.body.content !== undefined) post.content = req.body.content;
    if (req.body.category !== undefined) post.category = req.body.category;
    await post.save();

    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    logger.error("Error updating post %s: %s", req.params?.id || req.query?._id, error.message, { stack: error.stack });
    if (error.name === "ValidationError")
      return res.status(403).json({ status: "error", message: error.message });
    return res.status(500).json({ status: "error", message: "Error Happened" });
  }
};

const deletePost = async function (req, res) {
  try {
    const postId = req.params?.id || req.query?._id || req.params?.post_id;
    const post = await postModel.findById(postId).populate("author");
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "post is not Found" });

    const authorEmail = post.author?.email;
    const authorId = post.author?._id
      ? post.author._id.toString()
      : post.author
      ? post.author.toString()
      : null;
    const currentUserId = req.currentUser?._id ? req.currentUser._id.toString() : "";
    const currentUserEmail = req.currentUser?.email;

    const isOwner =
      (authorEmail && currentUserEmail && authorEmail === currentUserEmail) ||
      (authorId && currentUserId && authorId === currentUserId) ||
      req.currentUser?.isAdmin;

    if (!isOwner)
      return res
        .status(403)
        .json({ status: "error", message: "you are not allowed to delete this post" });

    await post.deleteOne();
    try {
      if (commentModel && typeof commentModel.deleteMany === "function") {
        await commentModel.deleteMany({ post_id: post._id });
      }
    } catch (commentErr) {
      logger.warn("Could not cascade delete comments for post %s: %s", postId, commentErr.message);
    }

    res
      .status(200)
      .json({ status: "success", message: "Post deleted successfully" });
  } catch (error) {
    logger.error("Error deleting post %s: %s", req.params?.id || req.query?._id, error.message, { stack: error.stack });
    return res.status(500).json({ status: "error", message: "try again" });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
};
