import {
  createContext, useState, useMemo, useEffect,
} from 'react';

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('user'));
  const [currentToken, setcurrentToken] = useState(localStorage.getItem('token') || null);
  const [currentUser, setcurrentUser] = useState(localStorage.getItem('user') || '');

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
    setcurrentToken(null);
    setcurrentUser('');
  };

  const data = useMemo(() => ({
    loggedIn, currentToken, currentUser, login, logout,
  }), [loggedIn, currentToken, currentUser]);

  useEffect(() => {
    const storedLoggedIn = !!localStorage.getItem('user');
    if (storedLoggedIn) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <authContext.Provider value={data}>
      {children}
    </authContext.Provider>
  );
};

export default authContext;
