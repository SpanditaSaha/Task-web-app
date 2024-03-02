import { createContext, useContext, useEffect, useState } from "react";

const taskContext = createContext();

const TaskProvider = ({ children }) => {
  const [task, setTask] = useState();

  useEffect(() => {
    const taskInfo = JSON.parse(localStorage.getItem("taskInfo"));
    setTask(taskInfo);
  }, []);

  return (
    <taskContext.Provider value={{ task, setTask }}>
      {children}
    </taskContext.Provider>
  );
};

export const TaskState = () => {
  return useContext(taskContext);
};

export default TaskProvider;
