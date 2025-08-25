import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon, User as UserIcon, ShieldCheck } from "lucide-react";
import axios from "axios";

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // Read both items directly from localStorage
    const userId = localStorage.getItem("userId");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const handleLogout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
                {},
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Failed to logout:", err);
        } finally {
            // Clear both items on logout
            localStorage.removeItem("userId");
            localStorage.removeItem("isAdmin");
            navigate("/login");
            window.location.reload();
        }
    };

    return (
        <nav className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white px-4 sm:px-6 py-3 shadow-md flex justify-between items-center transition-colors duration-300 sticky top-0 z-50">
            <div className="text-xl font-bold">
                <Link to="/" className="bg-gradient-to-r from-blue-500 to-violet-500 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                    CodeJudge
                </Link>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-5 text-sm font-medium">
                <Link to="/problems" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">
                    Problems
                </Link>

                {/* This will now work correctly and instantly */}
                {isAdmin && (
                    <Link to="/admin" title="Admin Panel" className="flex items-center gap-1 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors">
                        <ShieldCheck className="h-5 w-5" />
                        Admin
                    </Link>
                )}

                {userId ? (
                    <>
                        <Link to="/profile" title="My Profile" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">
                            <UserIcon className="h-5 w-5" />
                        </Link>
                        <button onClick={handleLogout} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 dark:from-emerald-500 dark:to-blue-500 text-white rounded-lg hover:from-blue-600 hover:to-violet-600 dark:hover:from-emerald-600 dark:hover:to-blue-600 transition-all transform hover:scale-105">
                            Sign Up
                        </Link>
                    </>
                )}
                
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;