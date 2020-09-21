const Task = require("../models/Task");
const { validationResult } = require("express-validator");

exports.getTasks = (req, res, next) => {
  Task.find()
    .sort("dueDate")
    .then((result) => {
      const tasks = [];
      result.forEach((t) => {
        tasks.push(t);
      });
      res.status(200).json({ tasks: tasks });
    })
    .catch((err) => next(err));
};

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

exports.editStatus = (req, res, next) => {
  console.log(req.body.name, req.body.status);
  Task.findOne({ name: req.body.name })
    .then((taskDoc) => {
      if (!taskDoc) {
        throw { statusCode: 404, message: "No Task Found to edit status" };
      }
      taskDoc.status = req.body.status;
      return taskDoc.save();
    })
    .then((result) => {
      res.status(201).json({ message: "Task Edited Succesfully" });
    })
    .catch((err) => next(err));
};
