import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Stack,
  Button,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { io } from "socket.io-client";

const TaskForm = ({ task, userId }) => {
  const [updatedTask, setUpdatedTask] = useState(task);
  const [updatedTitle, setNewUpdatedTitle] = useState(updatedTask.title);
  const [updatedDescription, setUpdatedDescription] = useState(
    updatedTask.description
  );
  const toast = useToast();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask({ ...updatedTask, [name]: value });
  };

  console.log(userId);

  const socket = io("https://task-web-app.onrender.com", {
    transports: ["websocket"],
  });
  const updateTask = (taskId, updatedTask, userId) => {
    socket.emit("taskUpdate", taskId, updatedTask, userId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("clicked");
    console.log("userId is :", userId);
    console.log("Task is: ", task);
    console.log(task.createdBy);
    if (task.collaborators.includes(userId) || task.createdBy === userId) {
      console.log("inside if:", userId);
      updateTask(task._id, updatedTask, userId);
      console.log(updateTask);
      if (updateTask) {
        toast({
          title: "Task Updated Successfully!!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        console.error("Error updateing task");
      }
    } else {
      toast({
        title: "You are not a collaborator!!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  socket.on("showtaskUpdate", (task) => {
    console.log("Task updated in client;", task);
    console.log("Task updated in client title: ", task.title);
    if (updatedTask._id === task._id) {
      setNewUpdatedTitle(task.title);
      setUpdatedDescription(task.description);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Heading as="h4" mb={2}>
        {updatedTitle}
      </Heading>
      {/* <Heading>Updated ass : {updatedTitle}</Heading> */}
      <Stack spacing={4}>
        <FormControl>
          {/* <FormLabel>Title</FormLabel> */}
          <Input
            type="text"
            name="title"
            value={updatedTask.title}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description: {updatedDescription}</FormLabel>
          <Textarea
            name="description"
            value={updatedTask.description}
            onChange={handleInputChange}
          />
        </FormControl>

        <Button type="submit" colorScheme="blue">
          Update Task
        </Button>
      </Stack>
    </form>
  );
};

export default TaskForm;
