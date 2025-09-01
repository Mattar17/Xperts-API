const mongoose = require("mongoose");
const fields = require("../utils/fields");

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.ObjectId,
    ref: "User",
  },
  documents: {
    type: [String],
  },
  category: {
    type: String,
    enum: fields,
  },
  creationDate: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Expert_Application", applicationSchema);
