const express = require("express");
const router = express.Router();
const authRouter = require("./auth.router");
const userRouter = require("./user.router");
const postRouter = require("./post.router");

router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);
router.use("/api/posts", postRouter);

module.exports = router;
