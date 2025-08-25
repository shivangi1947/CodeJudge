// import React, { createContext, useState, useContext, useEffect } from 'react';

// // Create the context
// const AuthContext = createContext(null);

// // Create the Provider component
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);

//     // On initial load, check if user data is in localStorage
//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//         }
//     }, []);

//     const login = (userData) => {
//         // Store user data in both state and localStorage
//         localStorage.setItem('user', JSON.stringify(userData));
//         setUser(userData);
//     };

//     const logout = () => {
//         // Clear user data from both state and localStorage
//         localStorage.removeItem('user');
//         setUser(null);
//     };

//     // The value provided to consuming components
//     const value = {
//         user,
//         isAuthenticated: !!user,
//         isAdmin: user?.role === 'admin',
//         login,
//         logout
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // Create a custom hook to use the auth context easily
// export const useAuth = () => {
//     return useContext(AuthContext);
// };