import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const authContext = {
    login,
    logout,
    isLoggedIn,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};
