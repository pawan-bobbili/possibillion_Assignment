const express = require("express");
const bp = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const TaskRoutes = require("./routes/Tasks");

const app = express();

app.use(cors());
app.use(bp.json());

app.use("/home", TaskRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Please Check URL" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal server error" });
});

mongoose
  .connect(
    "mongodb+srv://node-user:Karnal18@cluster0-sgm7m.mongodb.net/possibillion?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(9000);
    console.log("Backend Established");
  })
  .catch((err) => console.log(err));
