const express = require("express");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const connectDB = require("./config/config");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const Task = require("./models/taskModel");
const cron = require("node-cron");
const reminderService = require("./services/reminderService");
const path = require("path");

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//   res.send("hello");
// });
cron.schedule("0 0 * * *", () => {
  reminderService.sendReminders();
});

app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

const __dirname1 = path.resolve();
console.log(path.join(__dirname1, "../frontend/dist"));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, (req, res) => {
  console.log(`server is running at http://localhost:${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("taskUpdate", async (userId, taskId, updatedTask) => {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: taskId, collaborators: userId },
        updatedTask,
        { new: true }
      );

      if (!task) {
        console.log("Task not found or user is not a collaborator.");
        return;
      }

      console.log(taskId);
      socket.emit("taskUpdate", task);
    } catch (error) {
      console.error(error);
    }
  });
});
