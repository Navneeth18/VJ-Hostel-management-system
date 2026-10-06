import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const isAuthenticated = () => {
        return !!user;
    };

    return (
        <UserContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
