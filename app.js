const express = require("express");
const bp = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(bp.json());

mongoose
  .connect(
    "mongodb+srv://node-user:Karnal18@cluster0-sgm7m.mongodb.net/possibillion?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(9000);
    console.log("Backend Established");
  })
  .catch((err) => console.log(err));
