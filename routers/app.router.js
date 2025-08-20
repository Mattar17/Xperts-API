const express = require("express");
const router = express.Router();
const authRouter = require("./auth.router");
const userRouter = require("./user.router");

router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);

module.exports = router;
