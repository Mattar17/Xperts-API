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
router.get("/users", authenticate, adminController.getAllUsers);
router.put(
  "/accept-application",
  authenticate,
  adminController.acceptApplication
);
router.delete("/users", authenticate, adminController.deleteUser);

module.exports = router;
