const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      createdBy: req.user._id,
    });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/***************** Category ****************/

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryName } = req.body;

    res.status(201).json({
      message: "Category created successfully",
      category: categoryName,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// const getTasksByCategoryLow = asyncHandler(async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const lowtasks = await Task.find({
//       createdBy: userId,
//       priority: "low",
//     });
//     if (lowtasks.length > 0) {
//       res.status(200).json({ lowtasks });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// const getTasksByCategoryMedium = asyncHandler(async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const mediumtasks = await Task.find({
//       createdBy: userId,
//       priority: "medium",
//     });
//     if (mediumtasks.length > 0) {
//       res.status(200).json({ mediumtasks });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// const getTasksByCategoryHigh = asyncHandler(async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const hightasks = await Task.find({
//       createdBy: userId,
//       priority: "high",
//     });
//     if (hightasks.length > 0) {
//       res.status(200).json({ hightasks });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

/************* progress ********************/

const taskCompleted = asyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { progress: "completed" },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getProgressCompleted = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const completedTasks = await Task.find({
      createdBy: userId,
      progress: "completed",
    });
    if (completedTasks.length > 0) {
      res.status(200).json({ completedTasks });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const getProgressnotCompleted = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const inprogressTasks = await Task.find({
      createdBy: userId,
      progress: "in progress",
    });
    if (inprogressTasks.length > 0) {
      res.status(200).json({ inprogressTasks });
    } else {
      console.log("No in completed tasks are here");
      res.status(200).json({ inprogressTasks });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// const getProgress = asyncHandler(async (req, res) => {
//   try {
//     const { progress } = req.params;
//     const tasks = await Task.find({ progress });
//     res.status(200).json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

/************** get dashboard tasks  ***********/

const getOverviewTasks = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const upcomingTasks = await Task.find({
      createdBy: userId,
      dueDate: { $gte: new Date() },
    }).sort({ dueDate: 1 });

    const overdueTasks = await Task.find({
      createdBy: userId,
      dueDate: { $lt: new Date() },
      progress: { $ne: "completed" },
    }).sort({ dueDate: -1 });

    const completedTasks = await Task.find({
      createdBy: userId,
      progress: "completed",
    })
      .sort({ updatedAt: -1 })
      .limit(5);

    res.status(200).json({ upcomingTasks, overdueTasks, completedTasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*************************** Get all Tasks ******************************/
const getAllTasks = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    // // Find the user by ID
    // const user = await User.findById({ userId });
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    const tasks = await Task.find({ createdBy: userId });
    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**************************** Share Task ****************************************/
const shareTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { email } = req.body;

  try {
    const task = await Task.findById(taskId);
    console.log(task);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const user = await User.findOne({ email });
    console.log(email);
    console.log(user);
    if (user) {
      console.log("User id: ", user._id);
      if (!task.collaborators.includes(user._id)) {
        task.collaborators.push(user._id);
        await task.save();
      }
      return res.status(200).json({ message: "Task shared successfully" });
    } else {
      console.log("User dose not exists");
    }
  } catch (error) {
    console.error("Error sharing task:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  createTask,

  taskCompleted,
  getProgressnotCompleted,
  getAllTasks,
  getOverviewTasks,
  getProgressCompleted,
  shareTask,
};
