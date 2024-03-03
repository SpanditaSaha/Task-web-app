import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";

import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { Hamburger } from "./Hamburger";
import "./Header.css";
const Header = () => {
  const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = storedUserInfo._id;
  const [showNavbar, setShowNavbar] = useState(false);
  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };
  const navigate = useNavigate();
  return (
    // <header className={classes.header}>
    //   <h1>
    //     <Link to={`/dashboard/${userId}`}>Task App</Link>
    //   </h1>

    //   <nav>
    //     <ul>
    //       <li>
    //         <Link to="/dashboard/createtask">Creare Tasks</Link>
    //       </li>
    //       <li>
    //         <Link to={`/dashboard/mytasks/${userId}`}>My Tasks</Link>
    //       </li>
    //       <li>
    //         <Link to={`/dashboard/taskmanager/${userId}`}>Collaborate</Link>
    //       </li>
    //       <li>
    //         <Link to={`/dashboard/sharedtask/${userId}`}>Shared Tasks</Link>
    //       </li>
    //       <li>
    //         <Button
    //           onClick={() => {
    //             localStorage.removeItem("userInfo");
    //             localStorage.removeItem("taskInfo");
    //             navigate("/");
    //           }}
    //         >
    //           Logout
    //         </Button>
    //       </li>
    //     </ul>
    //   </nav>
    // </header>
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          {/* <Link to={`/dashboard/${userId}`}>Task App</Link> */}
          Task App
        </div>
        <div className="menu-icon" onClick={handleShowNavbar}>
          <Hamburger />
        </div>
        <div className={`nav-elements  ${showNavbar && "active"}`}>
          <ul>
            <li>
              <NavLink to={`/dashboard/${userId}`}>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/createtask">Creare Tasks</NavLink>
            </li>
            <li>
              <NavLink to={`/dashboard/mytasks/${userId}`}>My Tasks</NavLink>
            </li>
            <li>
              <NavLink to={`/dashboard/taskmanager/${userId}`}>
                Collaborate
              </NavLink>
            </li>
            <li>
              <NavLink to={`/dashboard/sharedtask/${userId}`}>
                Shared Tasks
              </NavLink>
            </li>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("userInfo");
                localStorage.removeItem("taskInfo");
                navigate("/");
              }}
            >
              Logout
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
