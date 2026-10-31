import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });
    
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // ADDED: Global storage for reports
    const [allReports, setAllReports] = useState(() => {
        const savedReports = localStorage.getItem('allReports');
        return savedReports ? JSON.parse(savedReports) : [];
    });
    
    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn);
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
        // ADDED: Sync reports to storage
        localStorage.setItem('allReports', JSON.stringify(allReports));
    }, [isLoggedIn, currentUser, allReports]);

    return (
        <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser, allReports, setAllReports }}>
            {children}
        </UserContext.Provider>
    );
};