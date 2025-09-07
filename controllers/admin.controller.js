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

    await applicant.save();

    return res
      .status(200)
      .json({ status: "SUCCESS", message: "Application Accepted" });
  } catch (error) {
    res.status(404).json("Error Happened");
  }
};

const getAllUsers = async function (req, res) {
  try {
    const users = await userModel.find();
    if (!users) res.status(404).json("No users found");

    return res.status(200).json({ status: "success", data: users });
  } catch (error) {
    res.status(500).json("Error");
  }
};

const deleteUser = async function (req, res) {
  try {
    const user = await userModel.findById(req.query._id);
    if (!user) return res.status(404).json("No user Found");

    await user.deleteOne();
    return res.status(200).json({ status: "success" });
  } catch (error) {
    return res.status(500).json("server Error");
  }
};

const toggleAdminRole = async function (req, res) {
  try {
    const user = await userModel.findById(req.query._id);
    if (!user)
      return res
        .status(404)
        .json({ status: "fail", message: "user isn't found" });

    if (user.isAdmin) {
      user.isAdmin = false;
      user.save();
      return res
        .status(200)
        .json({ status: "success", message: "user is back to normal user" });
    } else {
      user.isAdmin = true;
      user.save();

      return res
        .status(200)
        .json({ status: "success", message: "user is updated to admin" });
    }
  } catch (error) {
    return res.status(500).json({ status: "fail" });
  }
};

module.exports = {
  getExpertsApplication,
  acceptApplication,
  getAllUsers,
  deleteUser,
  toggleAdminRole,
};
