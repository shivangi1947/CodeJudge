import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Tag } from "lucide-react";

const ProblemCard = ({ problem }) => {
    const navigate = useNavigate();

    // Function to navigate to the detailed problem page
    const handleSolveClick = () => {
        navigate(`/probdetail/${problem._id}`);
    };

    // Color mapping for problem difficulty levels for better visual distinction
    const difficultyColors = {
        Easy: "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20",
        Medium: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
        Hard: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
    };

    // Animation variants inherited from the parent list component
    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    };

    return (
        <motion.div
            variants={itemVariants}
            className="group bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-lg p-4 transition-all duration-300 hover:border-blue-400/50 dark:hover:border-emerald-500/50 hover:shadow-lg"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left side: Problem Title, Difficulty, and Tags */}
                <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        {problem.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full border ${difficultyColors[problem.difficulty] || difficultyColors.Medium}`}>
                            {problem.difficulty}
                        </span>
                        {/* Render tags if they exist */}
                        {problem.tags?.map((tag, idx) => (
                            <span key={idx} className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-500/10 px-2 py-1 rounded-full">
                                <Tag className="h-3 w-3" />
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right side: Solve Now Button */}
                <button
                    onClick={handleSolveClick}
                    className="flex-shrink-0 group-hover:bg-gradient-to-r from-blue-500 to-violet-500 dark:from-emerald-500 dark:to-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all transform group-hover:scale-105 group-hover:shadow-md flex items-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                    <span>Solve Now</span>
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </motion.div>
    );
};

export default ProblemCard;
