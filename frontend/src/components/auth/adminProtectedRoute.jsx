import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Navbar from '../layout/Navbar'; // Assuming you want the navbar on the loading screen

const AdminProtectedRoute = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
                    withCredentials: true,
                });
                setIsAdmin(true);
            } catch (error) {
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAdminStatus();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
                <Navbar />
                <div className="flex items-center justify-center flex-grow">
                    <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
                </div>
            </div>
        );
    }

    // If check is complete, either render the protected page or redirect
    return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminProtectedRoute;