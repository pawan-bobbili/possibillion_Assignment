const express = require("express");
const bp = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 9000;

const TaskRoutes = require("./routes/Tasks");
const { MONGOURI } = require("./config/appkeys");

const app = express();

app.use(cors());
app.use(bp.json());

app.use("/home", TaskRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal server error" });
});

mongoose
  .connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Backend Established");
  })
  .catch((err) => console.log(err));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
