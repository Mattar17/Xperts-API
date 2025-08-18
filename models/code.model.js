const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  code: {
    type: String,
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 15 * 60 * 1000,
    expires: 900,
  },
});

module.exports = mongoose.model("Code", codeSchema);
