const express = require("express");
const router = express.Router();
const authRouter = require("./auth.router.js");
const userRouter = require("./user.router.js");
const postRouter = require("./post.router.js");
const adminRouter = require("./admin.router.js");
const apiKeyValidator = require("../middlewares/validateApiKey.js");

if (process.env.NODE_ENV === "production") {
  router.use(apiKeyValidator);
}

router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);
router.use("/api/posts", postRouter);
router.use("/api/admin", adminRouter);

module.exports = router;
