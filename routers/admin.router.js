const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authenticate = require("../middlewares/authenticate");
const adminOnly = require("../middlewares/adminOnly");
const hasSuperAdminKey = require("../middlewares/hasSuperAdminKey");

router.get(
  "/experts-applications",
  authenticate,
  adminOnly,
  adminController.getExpertsApplication
);
router.get("/users", authenticate, adminOnly, adminController.getAllUsers);
router.put(
  "/accept-application",
  authenticate,
  adminOnly,
  adminController.acceptApplication
);
router.delete("/users", authenticate, adminOnly, adminController.deleteUser);
router.patch(
  "/toggle-admin",
  authenticate,
  hasSuperAdminKey,
  adminController.toggleAdminRole
);

module.exports = router;
