const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
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

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

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
    res.sendFile(path.resolve(__dirname1, "../frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

app.use(notFound);
app.use(errorHandler);

// const io = new Server(server);

const io = require("socket.io")(server, {
  cors: {
    origin: "https://task-web-app.onrender.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A new user connected", socket.id);
  socket.on("taskUpdate", async (taskId, updatedTask, userId) => {
    try {
      console.log(userId);
      const task = await Task.findOneAndUpdate(
        {
          _id: taskId,
          $or: [{ createdBy: userId }, { collaborators: userId }],
        },
        updatedTask,
        { new: true }
      );
      console.log(userId);
      console.log(task);
      console.log(task.createdBy);
      console.log(task.collaborators);
      if (updatedTask) {
        console.log("Task updated successfully:", updatedTask);
      } else {
        console.log("You are not authorized to update this task");
      }

      io.emit("showtaskUpdate", task);
      //socket.broadcast.emit("showtaskUpdate", task);
    } catch (error) {
      console.error(error);
    }
  });
});

server.listen(PORT, (req, res) => {
  console.log(`server is running at http://localhost:${PORT}`);
});

/**************** old code for socket io ****************************** */
/*const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    // origin: "https://task-web-app.onrender.com",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("setup", (user) => {
    socket.join(user._id);
    console.log("user under socket", user._id);
    socket.emit("connected");
  });

  

  // socket.on("disconnect", () => {
  //   console.log("Client disconnected");
  // });

  socket.on("taskUpdate", async (taskId, updatedTask, userId) => {
    try {
      console.log(userId);
      const task = await Task.findOneAndUpdate(
        {
          _id: taskId,
          $or: [{ createdBy: userId }, { collaborators: userId }],
        },
        updatedTask,
        { new: true }
      );
      console.log(userId);
      console.log(task);
      console.log(task.createdBy);
      console.log(task.collaborators);
      if (updatedTask) {
        console.log("Task updated successfully:", updatedTask);
      } else {
        console.log("You are not authorized to update this task");
      }

      socket.emit("taskUpdate", task);
      socket.broadcast.emit("taskUpdate", task);
    } catch (error) {
      console.error(error);
    }
  });

 
});*/
