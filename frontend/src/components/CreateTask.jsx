import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  Textarea,
  Button,
  Stack,
  Select,
  Divider,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { UserState } from "../context/UserContext";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  const { user, setUser } = UserState();

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit clicked");
    console.log(user.token);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/task/create",
        { title, description, dueDate, priority },
        config
      );
      toast({
        title: "Task Created Successfully!!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("taskInfo", JSON.stringify(data));
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
    } catch (error) {
      console.error("Error creating task:", error);
    }
    console.log({ title, description, dueDate, priority });
  };

  return (
    <>
      <Flex justify="center" align="center" minH="100vh">
        <Box w="50%" p={8} borderWidth="1px" borderRadius="lg">
          <Button>
            <Link to={`/dashboard/${user._id}`}>
              <ArrowBackIcon />
            </Link>
          </Button>
          <Heading mb={4} textAlign={"center"} color={"#40679E"}>
            Create Task
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Input
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <Textarea
                name="description"
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <Input
                type="date"
                name="dueDate"
                placeholder="Due Date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
              <Select
                name="priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
              <Button type="submit" colorScheme="blue" onClick={handleSubmit}>
                Create Task
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </>
  );
};

export default CreateTask;
