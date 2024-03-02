import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { UserState } from "../context/UserContext";

const TaskSharingForm = ({ taskId }) => {
  const [email, setEmail] = useState("");
  const { user, setUser } = UserState();
  const toast = useToast();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleShareTask = async () => {
    try {
      console.log(email);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post(
        `/api/task/tasks/${taskId}/share`,
        { email },
        config
      );

      toast({
        title: "Task Has Been Shared Successfully!",
        description: `Task has been shared with ${email}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setEmail("");
    } catch (error) {
      console.error("Error sharing task:", error.message);
      toast({
        title: "Error",
        description: "Failed to share task. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack spacing={4} mb={4}>
      <FormControl id="email">
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter email address"
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleShareTask}>
        Share Task
      </Button>
    </Stack>
  );
};

export default TaskSharingForm;
