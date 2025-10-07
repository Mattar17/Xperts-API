require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const appRouter = require("./routers/app.router");
const cors = require("cors");

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors(corsOptions));

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
