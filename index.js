require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const appRouter = require("./routers/app.router");

const app = express();
app.use(express.json());
app.use(express.urlencoded());

mongoose
  .connect(process.env.DEV_CONNECTION_STRING)
  .then(() => {
    console.log("mongoose server started");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", appRouter);

app.get("/", (req, res) => {
  res.json("express is running!!!!");
});

app.listen(5000, () => {
  console.log("express server started");
});
