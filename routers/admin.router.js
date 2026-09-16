const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller.js");
const authenticate = require("../middlewares/authenticate.js");
const adminOnly = require("../middlewares/adminOnly.js");
const hasSuperAdminKey = require("../middlewares/hasSuperAdminKey.js");

router.get(
  "/experts-applications",
  authenticate,
  adminOnly,
  adminController.getExpertsApplication,
);
router.get("/users", authenticate, adminOnly, adminController.getAllUsers);
router.put(
  "/experts-applications/:application_id",
  authenticate,
  adminOnly,
  adminController.acceptApplication,
);
router.delete(
  "/users/:_id",
  authenticate,
  adminOnly,
  adminController.deleteUser,
);
router.patch(
  "/toggle-admin/:_id",
  authenticate,
  hasSuperAdminKey,
  adminController.toggleAdminRole,
);

module.exports = router;
