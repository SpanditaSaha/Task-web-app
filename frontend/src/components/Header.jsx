import { Link, Navigate, useNavigate } from "react-router-dom";
import classes from "./Header.module.css";
import { Button } from "@chakra-ui/react";

const Header = () => {
  const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = storedUserInfo._id;

  const navigate = useNavigate();
  return (
    <header className={classes.header}>
      <h1>
        <Link to={`/dashboard/${userId}`}>Task App</Link>
      </h1>

      <nav>
        <ul>
          <li>
            <Link to="/dashboard/createtask">Creare Tasks</Link>
          </li>
          <li>
            <Link to={`/dashboard/mytasks/${userId}`}>My Tasks</Link>
          </li>
          <li>
            <Link to={`/dashboard/taskmanager/${userId}`}>Collaborate</Link>
          </li>
          <li>
            <Button
              onClick={() => {
                localStorage.removeItem("userInfo");
                localStorage.removeItem("taskInfo");
                navigate("/");
              }}
            >
              Logout
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
