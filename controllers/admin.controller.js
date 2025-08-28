const expertApplicationModel = require("../models/expertApplication.model");

const getExpertsApplication = async function (req, res) {
  try {
    const Applications = await expertApplicationModel
      .find({}, { _id: false })
      .populate("applicant", { _id: 0, password: 0 });
    if (!Applications || Applications.length === 0)
      return res.status(404).json("No Applications");

    return res.status(200).json({ status: "success", data: Applications });
  } catch (error) {
    return res.status(403).json("Error Happened!!!");
  }
};

module.exports = {
  getExpertsApplication,
};
