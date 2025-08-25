import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProblemCard from "./ProblemCard";
import { motion } from "framer-motion";
import { AlertTriangle, List, Search, X, ArrowLeft, ArrowRight } from "lucide-react";

// Skeleton component remains the same
const ProblemSkeleton = () => (
    <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-10 bg-slate-300 dark:bg-slate-600 rounded-lg w-24"></div>
        </div>
    </div>
);

const ProblemList = () => {
    // Component State
    const [problemData, setProblemData] = useState({ problems: [], totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    // 1. State is managed in the URL using useSearchParams
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const page = parseInt(searchParams.get('page'), 10) || 1;

    // --- DEBOUNCE LOGIC (INTEGRATED) ---
    // State to hold the final, debounced search term for the API call
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    // This useEffect handles the debouncing directly
    useEffect(() => {
        // Set a timer. When it fires, update the debounced term.
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms delay

        // If the user types again, clear the previous timer to reset the delay
        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]); // This effect only runs when the 'searchTerm' changes

    // Helper function to update URL search parameters
    const updateSearchParams = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        // Always reset to page 1 when a filter changes
        if (key !== 'page') {
            newParams.set('page', '1');
        }
        setSearchParams(newParams);
    };

    // 3. Centralized fetch logic using all state from URL
    const fetchProblems = useCallback(async () => {
        setLoading(true);
        setError(""); // Reset error on new fetch
        try {
            const params = new URLSearchParams({
                search: debouncedSearchTerm, // Use the debounced value for the API call
                difficulty,
                sortBy,
                page,
                limit: 10,
            });
            
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/problems?${params.toString()}`,
                { withCredentials: true }
            );
            setProblemData(res.data); // API now returns { problems: [], totalPages: ... }

        } catch (err) {
            console.error("Error fetching problems:", err);
            if (err.response?.status === 401) {
                setError("Your session has expired. Please log in again.");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setError("Could not fetch problems. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    }, [navigate, debouncedSearchTerm, difficulty, sortBy, page]);

    // 4. useEffect triggers fetching when a debounced value or any filter changes
    useEffect(() => {
        fetchProblems();
    }, [fetchProblems]);

    const handleResetFilters = () => {
        setSearchParams({});
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= problemData.totalPages) {
            updateSearchParams('page', newPage);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-black text-slate-800 dark:text-white transition-colors duration-300">
            <main className="flex-grow max-w-4xl mx-auto px-4 py-8 w-full">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-4 mb-6">
                    <List className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">All Problems</h1>
                </motion.div>

                {/* Filter and Search Controls */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8 p-4 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col sm:flex-row gap-4 items-center flex-wrap">
                    <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input type="text" placeholder="Search by problem title..." value={searchTerm} onChange={(e) => updateSearchParams('search', e.target.value)} className="w-full pl-10 p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"/>
                    </div>
                    <select value={difficulty} onChange={(e) => updateSearchParams('difficulty', e.target.value)} className="w-full sm:w-auto p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    {/* 5. Sort By Dropdown */}
                    <select value={sortBy} onChange={(e) => updateSearchParams('sortBy', e.target.value)} className="w-full sm:w-auto p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
                        <option value="createdAt">Newest</option>
                        <option value="title">Title</option>
                        <option value="difficulty">Difficulty</option>
                    </select>
                    <button onClick={handleResetFilters} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition">
                        <X size={16} /> Reset
                    </button>
                </motion.div>

                {error && ( /* Error display remains the same */ <div className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-3" role="alert"><AlertTriangle className="h-5 w-5" /><span>{error}</span></div> )}

                <motion.div className="grid gap-4" variants={containerVariants} initial="hidden" animate="visible">
                    {loading
                        ? Array.from({ length: 5 }).map((_, index) => <ProblemSkeleton key={index} />)
                        : problemData.problems.length > 0
                            ? problemData.problems.map((problem) => (
                                <ProblemCard key={problem._id} problem={problem} />
                            ))
                            : !error && <p className="text-center text-slate-500 dark:text-slate-400 col-span-full">No problems found matching your criteria.</p>
                    }
                </motion.div>

                {/* 6. Pagination Controls */}
                {!loading && problemData.totalPages > 1 && (
                    <div className="flex justify-center items-center mt-8 gap-4">
                        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                            <ArrowLeft size={20} />
                        </button>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                            Page {page} of {problemData.totalPages}
                        </span>
                        <button onClick={() => handlePageChange(page + 1)} disabled={page === problemData.totalPages} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProblemList;