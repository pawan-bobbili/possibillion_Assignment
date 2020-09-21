const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
      index: true,
    },
    priority: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    dueDate: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tasks", TaskSchema, "Tasks");
