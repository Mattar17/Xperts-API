const mongoose = require("mongoose");
const fields = require("../utils/fields.js");

require("./comment.model.js");

const postSchema = new mongoose.Schema(
  {
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
      default: Date.now,
    },
    category: {
      type: String,
      enum: fields,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post_id",
});

module.exports = mongoose.model("Post", postSchema);
