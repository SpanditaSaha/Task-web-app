import React, { useState, useEffect } from "react";
import {
  Flex,
  Checkbox,
  Progress,
  VStack,
  Box,
  Grid,
  GridItem,
  Text,
  Select,
  RadioGroup,
  Radio,
  useToast,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import { UserState } from "../context/UserContext";
import { TaskState } from "../context/TaskContext";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { user, setUser } = UserState();
  const { task, setTask } = TaskState();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const toast = useToast();
  let checked = true;
  useEffect(() => {
    const fetchTasks = async () => {
      console.log("fetch chats happended");
      console.log(user.token);

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        if (filter === "all") {
          const response = await axios.get(
            `/api/task/tasks/${user._id}`,
            config
          );
          console.log("Fetch tasks all dta : ", response.data.tasks);

          setTasks(response.data.tasks);
        } else if (filter === "completed") {
          const response = await axios.get(
            `/api/task/tasks/completed/${user._id}`,
            config
          );
          console.log(
            "Fetch tasks completed data : ",
            response.data.completedTasks
          );
          if (response.data.completedTasks.length > 0) {
            setTasks(response.data.completedTasks);
          } else {
            toast({
              title: "No tasks are completed",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setTasks("");
          }
        } else if (filter === "incomplete") {
          const response = await axios.get(
            `/api/task/tasks/notcompleted/${user._id}`,
            config
          );
          console.log(
            "Fetch tasks not completed data : ",
            response.data.inprogressTasks
          );
          if (response.data.inprogressTasks) {
            setTasks(response.data.inprogressTasks);
          } else {
            toast({
              title: "No tasks are in progress",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setTasks("");
          }
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [filter, user._id, user.token]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  const sortTasks = (tasks) => {
    return tasks.slice().sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === "priority") {
        const priorityOrder = { low: 0, medium: 1, high: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };
  const handleTaskStatusChange = async (taskId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/task/${taskId}/completed`, config);
      console.log(data);
      const response = await axios.get(`/api/task/tasks/${user._id}`, config);
      console.log("Fetch tasks all dta : ", response.data.tasks);

      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  const calculateProgress = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.progress === "completed"
    ).length;
    return (completedTasks / totalTasks) * 100;
  };

  return (
    <>
      <Heading m={14} textAlign={"center"} color={"#40679E"}>
        My Tasks
      </Heading>
      <Flex direction="column" align="center" mt={8}>
        <Flex align="center" justify="center" mb={4}>
          <Select
            placeholder="Filter Tasks"
            value={filter}
            onChange={handleFilterChange}
            mr={4}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">In Progress</option>
          </Select>
          <RadioGroup
            value={sortBy}
            onChange={handleSortChange}
            defaultValue="dueDate"
            mr={4}
          >
            <Flex direction="row">
              <Radio value="dueDate">Due Date</Radio>
              <Radio value="priority" ml={2}>
                Priority
              </Radio>
            </Flex>
          </RadioGroup>
        </Flex>
        {sortTasks(tasks).map((task) => (
          <Flex key={task.id} align="center" justify="space-between" my={2}>
            <Checkbox
              key={task._id}
              size="lg"
              colorScheme="orange"
              //isChecked={task.completed}
              onChange={() => handleTaskStatusChange(task._id)}
            >
              <Text>{task.title}</Text>
            </Checkbox>
            {task.progress === "completed" ? (
              <Box margin={4}>
                <h3>Completed</h3>
              </Box>
            ) : (
              <Box margin={4}>
                <h3>In Progress</h3>
              </Box>
            )}
          </Flex>
        ))}
        <Box w="50%" mt={4}>
          Progress
          <Progress value={calculateProgress()} />
        </Box>
      </Flex>
    </>
  );
};

export default MyTasks;
