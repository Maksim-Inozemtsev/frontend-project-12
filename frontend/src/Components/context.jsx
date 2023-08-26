import { createContext, useState } from 'react';

const authContext = createContext(!!localStorage.getItem('user'));

export const ContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentToken, setcurrentToken] = useState(null);
  const [currentUser, setcurrentUser] = useState('');

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
    setLoggedIn(true);
    setcurrentToken(token);
    setcurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  const data = {
    loggedIn, currentToken, currentUser, login, logout,
  };

  return (
    <authContext.Provider value={data}>
      {children}
    </authContext.Provider>
  );
};

export default authContext;
