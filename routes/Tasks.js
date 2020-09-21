const express = require("express");
const { body } = require("express-validator");

const TaskController = require("../controller/Task");

const router = express.Router();

router.get("/alltasks", TaskController.getTasks);

router.put(
  "/createtask",
  [
    body("name")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Task should be atleast 5 characters long"),
    body("dueDate")
      .isNumeric()
      .custom((val) => {
        let presentDate = Date.now();
        console.log(val, presentDate);
        if (val < presentDate) {
          throw "Due date is in Past";
        }
        return true;
      }),
  ],
  TaskController.CreateTask
);

router.post("/editstatus", TaskController.editStatus);

module.exports = router;
