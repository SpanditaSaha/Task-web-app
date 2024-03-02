import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const userContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  // const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    // if (!userInfo) {
    //   navigate("/");
    // }
  }, []);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};

export const UserState = () => {
  return useContext(userContext);
};

export default UserProvider;
