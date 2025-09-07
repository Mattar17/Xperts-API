const mongoose = require("mongoose");
const fields = require("../utils/fields");

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
    enum: fields,
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
  documents: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
