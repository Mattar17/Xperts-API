const postModel = require("../models/post.model");

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
      .populate("comments.author", "name pfp_url creationDate")
      .limit(limit)
      .skip(skip);

    if (!posts || posts.length === 0)
      return res.status(404).json({ status: "error", message: "no posts" });
    return res.status(200).json({ status: "success", posts });
  } catch (error) {
    return res
      .status(500)
      .json({
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
    if (error.name === "ValidationError")
      res.status(403).json({ status: "error", message: error.message });

    res.status(500).json({ status: "error", message: "Error happened" });
  }
};

const updatePost = async function (req, res) {
  try {
    const post = await postModel.findById(req.query._id).populate("author");
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "post is not Found" });

    if (req.currentUser.email != post.author.email)
      return res.status(403).json({
        status: "error",
        message: "you are not allowed to edit this post",
      });

    Object.assign(post, req.body);
    await post.save();

    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    if (error.name === "ValidationError")
      res.status(403).json({ status: "error", message: error.message });
    res.status(500).json({ status: "error", message: "Error Happened" });
  }
};

const deletePost = async function (req, res) {
  try {
    const post = await postModel.findById(req.query._id).populate("author");
    if (!post) return res.status(404).json("post is not Found");

    if (req.currentUser.email != post.author.email)
      return res.status(403).json("you are not allowed to delete this post");

    await post.deleteOne();
    res
      .status(200)
      .json({ status: "success", message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "try again" });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
};
