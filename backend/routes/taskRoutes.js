const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  createTask,
  getAllTasks,
  getProgressCompleted,
  getProgressnotCompleted,
  shareTask,
} = require("../controllers/taskControllers");
const { getTasksByCategory } = require("../controllers/taskControllers");
const { taskCompleted } = require("../controllers/taskControllers");
const { taskInProgress } = require("../controllers/taskControllers");
const { getProgress } = require("../controllers/taskControllers");
const { getOverviewTasks } = require("../controllers/taskControllers");
const router = express.Router();

/******* create task *******/
router.post("/create", protect, createTask);
//router.get("/category/:categoryName", protect, getTasksByCategory);

/***** task progress *******/
router.get("/:taskId/completed", protect, taskCompleted);

/************* tasks organized by priority */

/************ get filtered tasks on progress **************/
router.get("/tasks/completed/:userId", protect, getProgressCompleted);
router.get("/tasks/notcompleted/:userId", protect, getProgressnotCompleted);

/***************** get all tasks **************************/
router.get("/tasks/:userId", protect, getAllTasks);

/******* get dashboard tasks ******/
router.get("/overview/:userId", protect, getOverviewTasks);

/****************** Share tasks ****************/
router.post("/tasks/:taskId/share", protect, shareTask);

module.exports = router;
