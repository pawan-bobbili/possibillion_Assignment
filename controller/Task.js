const Task = require("../models/Task");
const { validationResult } = require("express-validator");

exports.CreateTask = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw { statusCode: 422, message: errors.array()[0].msg };
  }
  Task.findOne({ name: req.body.name })
    .then((taskDoc) => {
      if (taskDoc) {
        throw {
          statusCode: 422,
          message: "Task Already exists, Try another name",
        };
      }
      return Task.create({
        name: req.body.name,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
      });
    })
    .then((result) => {
      res.status(201).json({ message: "Task Created Successfully" });
    })
    .catch((err) => next(err));
};
