import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";

import { UserState } from "../../context/UserContext";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [tasks, setTasks] = useState({
    upcomingTasks: [],
    overdueTasks: [],
    completedTasks: [],
  });
  // const params = useParams();
  // const userId = params.userId;
  const { user, setUser } = UserState();

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
        const response = await axios.get(
          `/api/task/overview/${user._id}`,
          config
        );
        setTasks(response.data);
        console.log(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh">
      <Box p={8} maxWidth="800px" width="100%">
        <Heading mb={4} textAlign={"center"} color={"#40679E"}>
          Dashboard
        </Heading>

        <Tabs isFitted variant="enclosed" mb={6} onChange={handleTabChange}>
          <TabList>
            <Tab
              onClick={() => handleTabChange("upcoming")}
              isSelected={selectedTab === "upcoming"}
            >
              Upcoming Tasks
            </Tab>
            <Tab
              onClick={() => handleTabChange("overdue")}
              isSelected={selectedTab === "overdue"}
            >
              Overdue Tasks
            </Tab>
            <Tab
              onClick={() => handleTabChange("completed")}
              isSelected={selectedTab === "completed"}
            >
              Completed Tasks
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack spacing={4}>
                {tasks.upcomingTasks.map((task, index) => (
                  <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                    <Text fontWeight="bold">{task.name}</Text>
                    <Text>Due Date: {task.dueDate}</Text>
                    <Text>Status: Upcoming</Text>
                  </Box>
                ))}
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack spacing={4}>
                {tasks.overdueTasks.map((task, index) => (
                  <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                    <Text fontWeight="bold">{task.name}</Text>
                    <Text>Due Date: {task.dueDate}</Text>
                    <Text>Status: Overdue</Text>
                  </Box>
                ))}
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack spacing={4}>
                {tasks.completedTasks.map((task, index) => (
                  <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                    <Text fontWeight="bold">{task.name}</Text>
                    <Text>Status: Completed</Text>
                  </Box>
                ))}
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Dashboard;
