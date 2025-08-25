import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Eye, EyeOff, Mail, KeyRound } from "lucide-react";
import Navbar from "../layout/Navbar";
import { motion } from "framer-motion";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, formData);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            navigate("/");
        } catch (err) {
            console.error("Signup failed:", err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Animation variants for the form container
    const containerVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
                duration: 0.4,
                ease: "easeOut",
            },
        },
    };

    // Animation variants for individual form items
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    };

    return (
        <div className="relative min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-black text-slate-800 dark:text-white transition-colors duration-300 overflow-hidden">
           

            {/* Floating background elements for visual consistency */}
            <div className="absolute top-1/4 -left-16 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-16 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse animation-delay-4000"></div>

            <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <motion.form
                        className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl p-8 space-y-6"
                        onSubmit={handleSubmit}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Create your Account
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                Already have an account?{" "}
                                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </motion.div>
                        
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-3" role="alert"
                            >
                                <span className="font-bold">Error:</span>
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants} className="space-y-4">
                            <div className="relative">
                                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    id="username" name="username" type="text" autoComplete="username" required autoFocus
                                    className="w-full pl-10 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 transition"
                                    placeholder="Username" value={formData.username} onChange={handleChange}
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    id="email" name="email" type="email" autoComplete="email" required
                                    className="w-full pl-10 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 transition"
                                    placeholder="Email address" value={formData.email} onChange={handleChange}
                                />
                            </div>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    id="password" name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password" required minLength={6}
                                    className="w-full pl-10 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 transition"
                                    placeholder="Password (min. 6 characters)" value={formData.password} onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <button
                                type="submit" disabled={loading}
                                className="group relative flex w-full justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-500 to-violet-500 dark:from-emerald-500 dark:to-blue-500 py-3 px-4 font-semibold text-white shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-emerald-500/30 transition-all transform hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed hover:bg-gradient-to-l"
                            >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <UserPlus className={`h-5 w-5 ${loading ? 'animate-pulse' : ''}`} />
                                </span>
                                {loading ? "Creating account..." : "Register"}
                            </button>
                        </motion.div>
                    </motion.form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
