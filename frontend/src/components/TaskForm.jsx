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
} from "@chakra-ui/react";

const TaskForm = ({ task, updateTask, userId }) => {
  const [updatedTask, setUpdatedTask] = useState(task);
  const toast = useToast();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask({ ...updatedTask, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userId);
    if (task.collaborators.includes(userId)) {
      console.log(userId);
      updateTask(task._id, updatedTask, userId);
      console.log(updatedTask);
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

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            name="title"
            value={updatedTask.title}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
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
