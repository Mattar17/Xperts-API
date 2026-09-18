const commentModel = require("../models/comment.model.js");
const postModel = require("../models/post.model.js");
const userModel = require("../models/user.model.js");
const logger = require("../utils/logger.js");

const getComments = async function (req, res) {
  try {
    const { post_id } = req.params;
    const post = await postModel.findById(post_id);
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "Post is deleted or not found" });

    const comments = await commentModel
      .find({ post_id })
      .populate("author", "-password")
      .sort({ creationDate: 1 });

    if (!comments || comments.length === 0)
      return res
        .status(404)
        .json({ status: "error", message: "No Comments Found" });

    return res.status(200).json({ status: "success", data: comments });
  } catch (error) {
    logger.error("Error fetching comments for post %s: %s", req.params?.post_id, error.message, { stack: error.stack });
    return res.status(500).json({
      status: "error",
      message: "Error Happened while fetching comments",
    });
  }
};

const createComment = async function (req, res) {
  try {
    const { post_id } = req.params;
    const post = await postModel.findById(post_id);
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "Post is deleted or not found" });

    const user = await userModel.findById(req.currentUser._id);
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });

    const postAuthorId = post.author?._id
      ? post.author._id.toString()
      : post.author?.toString();

    if (
      postAuthorId !== req.currentUser._id.toString() &&
      (user.expertIn === "" || user.expertIn !== post.category)
    )
      return res.status(403).json({
        status: "error",
        message: "You're not allowed to comment on this post",
      });

    const newComment = new commentModel({
      text: req.body.text,
      post_id,
      author: user._id,
    });
    await newComment.save();
    await newComment.populate("author", "-password");

    return res.status(200).json({ status: "success", data: newComment });
  } catch (error) {
    logger.error("Error creating comment on post %s: %s", req.params?.post_id, error.message, { stack: error.stack });
    if (error.name === "ValidationError") {
      return res.status(400).json({ status: "error", message: error.message });
    }
    return res
      .status(500)
      .json({ status: "error", message: "Error while adding the comment" });
  }
};

const updateComment = async function (req, res) {
  try {
    const { post_id, comment_id } = req.params;
    const post = await postModel.findById(post_id);
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "Post is deleted or not found" });

    const comment = await commentModel.findOne({ _id: comment_id, post_id });
    if (!comment)
      return res
        .status(404)
        .json({ status: "error", message: "Comment not found" });

    const commentAuthorId = comment.author?._id
      ? comment.author._id.toString()
      : comment.author?.toString();

    if (commentAuthorId !== req.currentUser._id.toString())
      return res.status(403).json({
        status: "error",
        message: "You are not allowed to update this comment",
      });

    comment.text = req.body.text;
    await comment.save();
    await comment.populate("author", "-password");

    return res
      .status(200)
      .json({ status: "success", message: "Comment updated successfully", data: comment });
  } catch (error) {
    logger.error("Error updating comment %s on post %s: %s", req.params?.comment_id, req.params?.post_id, error.message, { stack: error.stack });
    if (error.name === "ValidationError") {
      return res.status(400).json({ status: "error", message: error.message });
    }
    return res
      .status(500)
      .json({ status: "error", message: "Error while updating the comment" });
  }
};

const deleteComment = async function (req, res) {
  try {
    const { post_id, comment_id } = req.params;
    const post = await postModel.findById(post_id);
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "Post is deleted or not found" });

    const comment = await commentModel.findOne({ _id: comment_id, post_id });
    if (!comment)
      return res
        .status(404)
        .json({ status: "error", message: "Comment not found" });

    const commentAuthorId = comment.author?._id
      ? comment.author._id.toString()
      : comment.author?.toString();

    if (commentAuthorId !== req.currentUser._id.toString())
      return res.status(403).json({
        status: "error",
        message: "You are not allowed to delete this comment",
      });

    await comment.deleteOne();
    return res
      .status(200)
      .json({ status: "success", message: "Comment deleted successfully" });
  } catch (error) {
    logger.error("Error deleting comment %s on post %s: %s", req.params?.comment_id, req.params?.post_id, error.message, { stack: error.stack });
    return res
      .status(500)
      .json({ status: "error", message: "Error while deleting the comment" });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
  updateComment,
};
