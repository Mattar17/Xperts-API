const express = require("express");
const router = express.Router();
const authRouter = require("./auth.router");
const userRouter = require("./user.router");
const postRouter = require("./post.router");
const adminRouter = require("./admin.router");
const apiKeyValidator = require("../middlewares/validateApiKey");

router.use(apiKeyValidator);

router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);
router.use("/api/posts", postRouter);
router.use("/api/admin", adminRouter);

module.exports = router;
