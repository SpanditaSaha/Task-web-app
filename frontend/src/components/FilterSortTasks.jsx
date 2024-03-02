import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Button,
  Checkbox,
  Select,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import axios from "axios";
import { UserState } from "../context/UserContext";

const FilterSortTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { user, setUser } = UserState();

  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

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
        const response = await axios.get(`/api/task/tasks/${user._id}`, config);
        console.log("Fetch tasks all dta : ", response.data.tasks);

        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") {
      return true;
    } else if (task.completed) {
      return task.completed;
    } else {
      return !task.completed;
    }
  });

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

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
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
      {sortTasks(filteredTasks).map((task) => (
        <Flex key={task.id} align="center" justify="center" my={2}>
          {/* <Checkbox
            isChecked={task.completed}
            onChange={() => handleTaskToggle(task.id)}
            mr={4}
          > */}
          {task.title}
          {/* </Checkbox> */}
        </Flex>
      ))}
    </Flex>
  );
};

export default FilterSortTasks;
