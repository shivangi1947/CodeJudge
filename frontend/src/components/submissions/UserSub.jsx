import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../layout/Navbar'; // Adjust path if needed
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SubmissionSkeleton = () => (
    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg animate-pulse">
        <div className="flex justify-between items-center mb-3">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        </div>
        <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
    </div>
);

const UserSubmissions = () => {
    const { problemId, userId } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/submissions/user/${userId}/problem/${problemId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Sort by most recent submission first
                setSubmissions(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                console.error("Error fetching submissions:", err);
                setError("Failed to load submissions. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [problemId, userId, navigate]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <button onClick={() => navigate(`/problems/${problemId}`)} className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-emerald-400 hover:underline mb-6">
                        <ArrowLeft size={16} />
                        Back to Problem
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                        Your Submissions
                    </h1>
                </motion.div>

                {error && <p className="text-red-500">{error}</p>}

                {loading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => <SubmissionSkeleton key={i} />)}
                    </div>
                ) : submissions.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400">No submissions found for this problem.</p>
                ) : (
                    <motion.ul
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {submissions.map((submission) => (
                            <motion.li
                                key={submission._id}
                                variants={itemVariants}
                                className="bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-lg"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <div className={`flex items-center gap-2 font-bold text-sm ${submission.verdict === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                                        {submission.verdict === 'Accepted' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        <span>{submission.verdict}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {new Date(submission.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <pre className="bg-white dark:bg-slate-900 p-3 rounded text-sm overflow-x-auto font-mono text-slate-700 dark:text-slate-300">
                                    {submission.code}
                                </pre>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </main>
        </div>
    );
};

export default UserSubmissions;
