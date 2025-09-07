const mongoose = require("mongoose");
const fields = require("../utils/fields");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minLength: [5, "minimum length is 5 characters"],
  },
  creationDate: {
    type: Date,
    default: new Date(),
  },
  author: {
    type: mongoose.ObjectId,
    ref: "User",
    autopopulate: true,
  },
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
    required: [true, "post content is required"],
    minLength: [10, "length of post must be atleast 10 characters "],
    maxLength: [300, "length of post must be atmost 300 characters "],
  },
  creationDate: {
    type: Date,
    default: new Date(),
  },
  category: {
    type: String,
    enum: fields,
  },
  author: {
    type: mongoose.ObjectId,
    ref: "User",
    autopopulate: true,
  },
  comments: [commentSchema],
});

module.exports = mongoose.model("Post", postSchema);
