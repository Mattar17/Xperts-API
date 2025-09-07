const postModel = require("../models/post.model");
const userModel = require("../models/user.model");

const getComments = async function (req, res) {
  try {
    const post = await postModel.findById(req.postId);
    if (!post) return res.status(404).json("Post is deleted or not found");

    const comments = post.comments;
    if (!comments || comments.length === 0)
      return res.status(404).json("No Comments Found");

    return res.status(200).json({ status: "success", data: comments });
  } catch (error) {
    res.status(500).json("Error Happened while fetching comments");
  }
};

const createComment = async function (req, res) {
  try {
    const user = await userModel.findOne({ email: req.currentUser.email });
    const post = await postModel.findById(req.query.postId);

    if (user.expertIn === "" || user.expertIn !== post.category)
      return res.status(403).json("You're not allowed to comment on this post");

    post.comments.push({ text: req.body.text, author: user._id });
    post.save();
    const updatedPost = await postModel
      .findById(req.query.postId)
      .populate("comments.author");
    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json("Error while adding the comment");
  }
};

updateComment = async function (req, res) {
  try {
    const post = await postModel.findById(req.query.postId);
    if (!post) return res.status(404).json("Post is deleted or not found");
    const comment = post.comments.id(req.query.commentId);
    if (!comment) return res.status(404).json("Comment not found");
    if (comment.author !== req.currentUser._id)
      return res.status(403).json("You are not allowed to update this comment");

    comment.text = req.body.text;
    await post.save();
    return res.status(200).json("Comment updated successfully");
  } catch (error) {
    return res.status(500).json("Error while updating the comment");
  }
};

const deleteComment = async function (req, res) {
  try {
    const post = await postModel.findById(req.query.postId);
    if (!post) return res.status(404).json("Post is deleted or not found");
    const comment = post.comments.id(req.query.commentId);
    if (!comment) return res.status(404).json("Comment not found");
    if (comment.author._id != req.currentUser._id)
      return res.status(403).json("You are not allowed to delete this comment");

    comment.deleteOne();
    await post.save();
    return res.status(200).json("Comment deleted successfully");
  } catch (error) {
    return res.status(500).json("Error while deleting the comment");
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
  updateComment,
};
