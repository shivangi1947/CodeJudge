import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import { User, Mail, BarChart2, Loader2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';

// --- Helper Components for the Profile Page ---

const StatCard = ({ title, value, children }) => (
    <div className="bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-lg">
        <h3 className="text-sm text-slate-500 dark:text-slate-400">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        {children}
    </div>
);

const SolvedChart = ({ data }) => {
    const COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };
    const chartData = [
        { name: 'Easy', value: data.Easy },
        { name: 'Medium', value: data.Medium },
        { name: 'Hard', value: data.Hard },
    ];
    const totalSolved = data.Easy + data.Medium + data.Hard;

    return (
        <div className="relative h-48 w-48 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{totalSolved}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Solved</span>
            </div>
        </div>
    );
};

const SubmissionHeatmap = ({ data }) => {
    const today = new Date();
    const oneYearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));

    const values = Object.keys(data).map(date => ({
        date: date,
        count: data[date],
    }));

    return (
        <CalendarHeatmap
            startDate={oneYearAgo}
            endDate={today}
            values={values}
            classForValue={(value) => {
                if (!value) {
                    return 'color-empty';
                }
                return `color-scale-${Math.min(4, Math.ceil(value.count / 2))}`;
            }}
            tooltipDataAttrs={value => {
                if (!value || !value.date) return {};
                const countText = value.count === 1 ? '1 submission' : `${value.count} submissions`;
                return {
                    'data-tooltip-id': 'heatmap-tooltip',
                    'data-tooltip-content': `${countText} on ${new Date(value.date).toDateString()}`,
                };
            }}
            showWeekdayLabels={true}
            showMonthLabels={true}
        />
    );
};


// --- Main Profile Page Component ---

const ProfilePage = () => {
    const { userId } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            // FIX: Uncommented this line to define currentUserId
            const currentUserId = localStorage.getItem("userId");
            
            try {
                const targetUserId = userId || currentUserId;
                if (!targetUserId) {
                    navigate('/login');
                    return;
                }
                
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/users/${targetUserId}/stats`,
                    { withCredentials: true }
                );
                setProfileData(res.data);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError("Could not load user profile.");
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate, userId]);

    if (loading || !profileData) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
                
                <div className="flex items-center justify-center flex-grow">
                    <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
                </div>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="min-h-screen bg-white dark:bg-slate-900">
               
                <main className="max-w-7xl mx-auto px-4 py-12">
                     <p className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</p>
                </main>
            </div>
        );
    }

    const { user, stats } = profileData;
    const { solvedByDifficulty, totalProblemsByDifficulty } = stats;

    return (
        <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-black text-slate-800 dark:text-white">
            <style>{`
                .react-calendar-heatmap .color-empty { fill: #ebedf0; }
                .dark .react-calendar-heatmap .color-empty { fill: #2d333b; }
                .react-calendar-heatmap .color-scale-1 { fill: #9be9a8; }
                .react-calendar-heatmap .color-scale-2 { fill: #40c463; }
                .react-calendar-heatmap .color-scale-3 { fill: #30a14e; }
                .react-calendar-heatmap .color-scale-4 { fill: #216e39; }
                .react-calendar-heatmap-month-label { transform: translateX(4px); }
            `}</style>
            
            
            
            <main className="max-w-7xl mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: User Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-violet-500 dark:from-emerald-500 dark:to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.username}</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Rank 117,425 (placeholder)</p>
                            </div>
                        </div>
                        <button className="w-full py-2 text-center font-semibold bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition">Edit Profile</button>
                        <div className="text-sm space-y-2 text-slate-600 dark:text-slate-300">
                            <p className="flex items-center gap-2"><MapPin size={16} /> India</p>
                            <p className="flex items-center gap-2"><Mail size={16} /> {user.email}</p>
                        </div>
                    </div>

                    {/* Right Column: Stats and Charts */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <StatCard title="Contest Rating" value="1,771" />
                             <StatCard title="Global Ranking" value="63,063" />
                             <StatCard title="Top" value="8.8%" />
                        </div>
                        
                        <div className="bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-4">Problems Solved</h3>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <SolvedChart data={solvedByDifficulty} />
                                <div className="flex-1 space-y-2 w-full">
                                    <div className="flex justify-between text-sm"><span className="text-green-500">Easy</span> <span>{solvedByDifficulty.Easy} / {totalProblemsByDifficulty.Easy}</span></div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{width: `${(solvedByDifficulty.Easy / (totalProblemsByDifficulty.Easy || 1)) * 100}%`}}></div></div>
                                    
                                    <div className="flex justify-between text-sm"><span className="text-yellow-500">Medium</span> <span>{solvedByDifficulty.Medium} / {totalProblemsByDifficulty.Medium}</span></div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-yellow-500 h-2.5 rounded-full" style={{width: `${(solvedByDifficulty.Medium / (totalProblemsByDifficulty.Medium || 1)) * 100}%`}}></div></div>
                                    
                                    <div className="flex justify-between text-sm"><span className="text-red-500">Hard</span> <span>{solvedByDifficulty.Hard} / {totalProblemsByDifficulty.Hard}</span></div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-red-500 h-2.5 rounded-full" style={{width: `${(solvedByDifficulty.Hard / (totalProblemsByDifficulty.Hard || 1)) * 100}%`}}></div></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-4">{stats.totalSubmissions} submissions in the past year</h3>
                            <div>
                                <SubmissionHeatmap data={stats.submissionCalendar} />
                            </div>
                        </div>

                    </div>

                </motion.div>
            </main>
            <ReactTooltip id="heatmap-tooltip" />
        </div>
    );
};

export default ProfilePage;
