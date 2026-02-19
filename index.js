const express = require("express");
const mongoose = require("mongoose");
const appRouter = require("./routers/app.router");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
require("dotenv").config();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "too many requests, please try again!!",
  validate: { trustProxy: true },
});
app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());

cron.schedule("*/5 * * * *", () => {
  console.log("Running the cron job every 5 minutes");
});

if (!global._mongooseConnected) {
  mongoose
    .connect(process.env.DEV_CONNECTION_STRING)
    .then(() => {
      console.log("mongoose server started");
    })
    .catch((err) => {
      console.log(err);
    });
  global._mongooseConnected = true;
}

app.use("/", appRouter);
app.use((req, res, next) => {
  res.status(404).json("resource not found");
});

app.listen(5000, () => {
  console.log("express server started");
});
