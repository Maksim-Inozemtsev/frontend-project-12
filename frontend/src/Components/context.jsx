import { createContext, useState } from 'react';

const authContext = createContext(!!localStorage.getItem('user'));

export const ContextProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);

    const login = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
        setLoggedIn(true);
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoggedIn(false);
    }

    const data = {
        loggedIn, login, logout
    }

    return (
        <authContext.Provider value={data}>
            {children}
        </authContext.Provider>
    )
};

export default authContext;