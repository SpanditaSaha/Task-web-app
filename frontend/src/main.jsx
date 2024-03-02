import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import UserProvider from "./context/UserContext.jsx";
import TaskProvider from "./context/TaskContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <TaskProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </TaskProvider>
    </UserProvider>
  </React.StrictMode>
);
