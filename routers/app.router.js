const express = require("express");
const router = express.Router();
const authRouter = require("./auth.router");
const userRouter = require("./user.router");
const postRouter = require("./post.router");
const adminRouter = require("./admin.router");

router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);
router.use("/api/posts", postRouter);
router.use("/api/admin", adminRouter);

module.exports = router;
