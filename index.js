const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routers/auth.router");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.DEV_CONNECTION_STRING)
  .then(() => {
    console.log("mongoose server started");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json("express is running!!!!");
});

app.listen(5000, () => {
  console.log("express server started");
});
