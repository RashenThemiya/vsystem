import React, { createContext, useContext, useEffect, useState } from "react";

// Create the Auth context
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// Auth Provider to manage authentication state
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [name, setName] = useState(localStorage.getItem("name") || null);

  // ✅ New helper function
  const setAuthData = (tokenValue, roleValue, nameValue) => {
    setToken(tokenValue);
    setRole(roleValue);
    setName(nameValue);

    if (tokenValue) {
      localStorage.setItem("token", tokenValue);
      localStorage.setItem("role", roleValue);
      localStorage.setItem("name", nameValue);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
    }
  };

  // Sync when values change (optional but fine)
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
    }
  }, [token, role, name]);

  // Logout function
  const logout = () => {
    setAuthData(null, null, null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        name,
        setAuthData, // ✅ Now available to LoginPage
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
