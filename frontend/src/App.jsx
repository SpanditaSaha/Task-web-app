import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./components/pages/Home";
import Dashboard from "./components/pages/Dashboard";

import ResetPassword from "./components/pages/ResetPassword";
import Root from "./components/pages/Root";
import CreateTask from "./components/CreateTask";
import MyTasks from "./components/MyTasks";
import TaskManager from "./components/TaskManager";
import SharedTasks from "./components/SharedTasks";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/resetpassword",
    element: <ResetPassword />,
  },

  {
    path: "/dashboard",
    element: <Root />,
    children: [
      {
        path: "/dashboard/:userId",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/createtask",
        element: <CreateTask />,
      },
      {
        path: "/dashboard/mytasks/:userId",
        element: <MyTasks />,
      },
      {
        path: "/dashboard/taskmanager/:userId",
        element: <TaskManager />,
      },
      {
        path: "/dashboard/sharedtask/:userId",
        element: <SharedTasks />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
