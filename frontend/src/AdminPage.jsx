import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';


const AdminPage = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch all problems when the component mounts
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                // Fetch a large number of problems for the admin view, bypassing default pagination
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problems?limit=200`, {
                    withCredentials: true,
                });
                setProblems(res.data.problems);
            } catch (err) {
                console.error("Failed to fetch problems:", err);
                setError("Could not load problems. You may not have the required permissions.");
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    // Handler to delete a problem
    const handleDeleteProblem = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete the problem: "${title}"?`)) {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/problems/${id}`, {
                    withCredentials: true,
                });
                // Update the UI instantly by removing the deleted problem from the state
                setProblems(prevProblems => prevProblems.filter(p => p._id !== id));
            } catch (err) {
                console.error("Failed to delete problem:", err);
                alert("Failed to delete the problem. Please try again.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                    {/* Link to a future "Create Problem" page */}
                    <Link
                        to="/admin/problems/new"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                    >
                        <Plus size={20} />
                        Create Problem
                    </Link>
                </div>

                {error ? (
                    <div className="bg-red-500/10 text-red-700 dark:text-red-400 p-4 rounded-md flex items-center gap-3">
                        <AlertTriangle size={20} />
                        <span>{error}</span>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Difficulty</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Tags</th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {problems.map((problem) => (
                                    <tr key={problem._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{problem.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{problem.difficulty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                                            {problem.tags.join(', ')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-4">
                                                {/* Link to a future "Edit Problem" page */}
                                                <Link to={`/admin/problems/edit/${problem._id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                    <Edit size={18} />
                                                </Link>
                                                <button onClick={() => handleDeleteProblem(problem._id, problem.title)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPage;