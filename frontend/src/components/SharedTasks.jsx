import { useState, useEffect } from "react";
import io from "socket.io-client";
import TaskForm from "./TaskForm";
import { UserState } from "../context/UserContext";
import axios from "axios";
import { Flex, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import TaskSharingForm from "./TaskSharingForm";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const { user, setUser } = UserState();
  const socket = io("http://localhost:3000", { transports: ["websocket"] });
  useEffect(() => {
    fetchSharedTasks();

    socket.on("taskUpdate", (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
      console.log("Task updated:", updatedTask);
    });

    return () => {
      socket.off("taskUpdated");
    };
  }, []);
  const fetchSharedTasks = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(
        `/api/task/tasks/shared/${user._id}`,
        config
      );
      console.log("Fetch tasks all shared tasks data : ", response.data.tasks);

      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateTask = (taskId, updatedTask, userId) => {
    socket.emit("taskUpdate", taskId, updatedTask, userId);
  };

  return (
    <Flex direction="column" align="center" p={4}>
      <Heading as="h1" mb={4} color={"#40679E"}>
        Shared Tasks
      </Heading>

      <UnorderedList listStyleType="none" p={0}>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            mb={4}
            rounded="lg"
            shadow="md"
            width={"100%"}
            p={"7"}
          >
            <Flex direction="column" alignItems="center">
              <Heading as="h3" mb={2}>
                {task.title}
              </Heading>

              <p>{task.description}</p>
              <TaskForm task={task} updateTask={updateTask} userId={user._id} />
              <TaskSharingForm taskId={task._id} />
            </Flex>
          </ListItem>
        ))}
      </UnorderedList>
    </Flex>
  );
};

export default TaskManager;
