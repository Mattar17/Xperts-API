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

module.exports = {
  getComments,
  createComment,
};
