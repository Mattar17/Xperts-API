const postModel = require("../models/post.model");
const userModel = require("../models/user.model");

const getComments = async function (req, res) {
  try {
    const post = await postModel.findById(req.postId);
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "Post is deleted or not found" });

    const comments = post.comments;
    if (!comments || comments.length === 0)
      return res
        .status(404)
        .json({ status: "error", message: "No Comments Found" });

    return res.status(200).json({ status: "success", data: comments });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error Happened while fetching comments",
      });
  }
};

const createComment = async function (req, res) {
  try {
    const user = await userModel.findById(req.currentUser._id);
    const post = await postModel.findById(req.query.postId);

    if (user.expertIn === "" || user.expertIn !== post.category)
      return res
        .status(403)
        .json({
          status: "error",
          message: "You're not allowed to comment on this post",
        });

    post.comments.push({ text: req.body.text, author: user._id });
    post.save();
    const updatedPost = await postModel
      .findById(req.query.postId)
      .populate("comments.author");
    return res.status(200).json({ status: "success", data: updatedPost });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error while adding the comment" });
  }
};

updateComment = async function (req, res) {
  try {
    const post = await postModel.findById(req.query.postId);
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "Post is deleted or not found" });
    const comment = post.comments.id(req.query.commentId);
    if (!comment)
      return res
        .status(404)
        .json({ status: "error", message: "Comment not found" });
    if (comment.author !== req.currentUser._id)
      return res
        .status(403)
        .json({
          status: "error",
          message: "You are not allowed to update this comment",
        });

    comment.text = req.body.text;
    await post.save();
    return res
      .status(200)
      .json({ status: "success", message: "Comment updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error while updating the comment" });
  }
};

const deleteComment = async function (req, res) {
  try {
    const post = await postModel.findById(req.query.postId);
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "Post is deleted or not found" });
    const comment = post.comments.id(req.query.commentId);
    if (!comment)
      return res
        .status(404)
        .json({ status: "error", message: "Comment not found" });
    if (comment.author._id != req.currentUser._id)
      return res
        .status(403)
        .json({
          status: "error",
          message: "You are not allowed to delete this comment",
        });

    comment.deleteOne();
    await post.save();
    return res
      .status(200)
      .json({ status: "success", message: "Comment deleted successfully" });
  } catch (error) {
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
