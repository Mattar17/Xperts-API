const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authenticate = require("../middlewares/authenticate");
const adminOnly = require("../middlewares/adminOnly");

router.get(
  "/experts-applications",
  authenticate,
  //adminOnly,
  adminController.getExpertsApplication
);
router.put("/accept-application", adminController.acceptApplication);

module.exports = router;
