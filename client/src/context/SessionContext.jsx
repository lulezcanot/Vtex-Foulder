import { createContext, useContext, useEffect, useState } from "react";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if(storedUser){
      setUser(storedUser);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, [])

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <SessionContext.Provider value={{ isLoggedIn, loading, user, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};
