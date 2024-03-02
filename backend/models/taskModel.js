const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  category: {
    type: String,
    default: "uncategorized",
  },

  progress: {
    type: String,
    // enum: ["in progress", "completed"],
    default: "in progress",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
