const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 2,
  },
  name: {
    type: String,
    required: true,
  },
  pfp_url: {
    type: String,
    default: "",
  },
  expertIn: {
    type: String,
    enum: ["", "engineering", "medical", "computer sceince", "graphic design"],
    default: "",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
