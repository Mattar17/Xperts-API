const expertApplicationModel = require("../models/expertApplication.model");
const userModel = require("../models/user.model");

const getExpertsApplication = async function (req, res) {
  try {
    const Applications = await expertApplicationModel
      .find({})
      .populate("applicant", { _id: 0, password: 0 });
    if (!Applications || Applications.length === 0)
      return res.status(404).json("No Applications");

    return res.status(200).json({ status: "success", data: Applications });
  } catch (error) {
    return res.status(403).json("Error Happened!!!");
  }
};

const acceptApplication = async function (req, res) {
  try {
    const application = await expertApplicationModel.findById(
      req.query.application_id
    );
    if (!application) return res.status(404).json("Not Found");

    const applicant = await userModel.findById(application.applicant._id);
    applicant.expertIn = application.category;

    return res
      .status(200)
      .json({ status: "SUCCESS", message: "Application Accepted" });
  } catch (error) {
    res.status(404).json("Error Happened");
  }
};

module.exports = {
  getExpertsApplication,
  acceptApplication,
};
