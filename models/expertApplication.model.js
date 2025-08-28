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
  field: {
    type: String,
    enum: fields,
  },
});

module.exports = mongoose.model("Expert_Application", applicationSchema);
