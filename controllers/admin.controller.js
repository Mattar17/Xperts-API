const expertApplicationModel = require("../models/expertApplication.model.js");
const userModel = require("../models/user.model.js");

const getExpertsApplication = async function (req, res) {
  try {
    const applications = await expertApplicationModel
      .find({})
      .populate("applicant", "-password");
    if (!applications || applications.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "No Applications found" });
    }

    return res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error fetching applications" });
  }
};

const acceptApplication = async function (req, res) {
  try {
    const { application_id } = req.params;
    const application = await expertApplicationModel.findById(application_id);
    if (!application) {
      return res
        .status(404)
        .json({ status: "error", message: "Application not found" });
    }

    const applicantId = application.applicant?._id || application.applicant;
    const applicant = await userModel.findById(applicantId);
    if (!applicant) {
      return res
        .status(404)
        .json({ status: "error", message: "Applicant not found" });
    }

    applicant.expertIn = application.category;
    applicant.documents = application.documents;

    await applicant.save();

    return res
      .status(200)
      .json({ status: "success", message: "Application Accepted" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error accepting application" });
  }
};

const getAllUsers = async function (req, res) {
  try {
    const users = await userModel.find().select("-password");
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "No users found" });
    }

    return res.status(200).json({ status: "success", data: users });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

const deleteUser = async function (req, res) {
  try {
    const { _id } = req.params;
    const user = await userModel.findById(_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "No user Found" });
    }

    await user.deleteOne();
    return res.status(200).json({ status: "success", message: "user deleted" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "server Error" });
  }
};

const toggleAdminRole = async function (req, res) {
  try {
    const { _id } = req.params;
    const user = await userModel.findById(_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "user isn't found" });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: user.isAdmin
        ? "user is updated to admin"
        : "user is back to normal user",
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: "server error" });
  }
};

module.exports = {
  getExpertsApplication,
  acceptApplication,
  getAllUsers,
  deleteUser,
  toggleAdminRole,
};

