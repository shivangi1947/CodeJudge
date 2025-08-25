import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { useTheme } from '../../contexts/ThemeContext';
import { Resizable } from 're-resizable';
import {
    Play,
    Upload,
    RefreshCw,
    Settings2,
    ChevronDown,
    Loader2,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Tag,
    History,
    FileText,
    Lightbulb,
    MessageSquare,
    Send,
    ThumbsUp,
    ThumbsDown,
    Star,
    Copy,
    Replace
} from 'lucide-react';
import Navbar from '../layout/Navbar';
import { motion } from 'framer-motion';

// --- Helper Components ---

const SkeletonLoader = () => (
    <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
        <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
    </div>
);

const ConsoleTabButton = ({ name, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(name.toLowerCase())}
        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-t-md
            ${activeTab === name.toLowerCase()
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                : 'text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-700/50'
            }`}
    >
        {name}
    </button>
);

const DescriptionTabButton = ({ name, icon, active = false, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200
        ${active
            ? 'text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 rounded-md shadow-sm'
            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
        }`}
    >
        {icon}
        <span>{name}</span>
    </button>
);


const ActionButton = ({ onClick, disabled, loading, text, icon, variant = 'primary' }) => {
    const variants = {
        primary: "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-800",
        secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed ${variants[variant]}`}
        >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : icon}
            <span>{loading ? 'Processing...' : text}</span>
        </button>
    );
};


// --- Main ProblemDetail Component ---

const ProblemDetail = () => {
    const defaultCode = `#include<bits/stdc++.h>
using namespace std;

int main() {
    // Write your logic here
    return 0;
}`;

    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState(null);
    const [customInput, setCustomInput] = useState('');
    const [loading, setLoading] = useState({ page: true, run: false, submit: false, submissions: false });
    const [verdict, setVerdict] = useState({ type: 'neutral', message: '' });
    const [activeConsoleTab, setActiveConsoleTab] = useState('testcase');
    const [activeDescriptionTab, setActiveDescriptionTab] = useState('description');
    const [submissions, setSubmissions] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const getLocalStorageKey = useCallback((problemId) => `code-${problemId}`, []);

    useEffect(() => {
        const fetchProblemAndCode = async () => {
            setLoading(prev => ({ ...prev, page: true }));
            // const token = localStorage.getItem("token");
            // if (!token) {
            //     navigate("/login");
            //     return;
            // }
            try {
                 const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/problems/${id}`,
                    { withCredentials: true } 
                );
                setProblem(res.data);
                // const savedCode = localStorage.getItem(getLocalStorageKey(id));
                const savedCode = localStorage.getItem(getLocalStorageKey(id));
                // Using the improved logic to check for boilerplate
                setCode(savedCode || problem.boilerplate || defaultCode);
                //setCode(savedCode || defaultCode);
            } catch (err) {
                console.error('Failed to fetch problem:', err);
                if (err.response?.status === 401) navigate("/signup");
            } finally {
                setLoading(prev => ({ ...prev, page: false }));
            }
        };
        fetchProblemAndCode();
    }, [id, getLocalStorageKey, defaultCode, navigate]);
// In your ProblemDetail.jsx component

    const handleRun = async (inputToUse) => {
        setLoading(prev => ({ ...prev, run: true }));
        setActiveConsoleTab('result');
        setOutput(null);
        setVerdict({ type: 'neutral', message: 'Running...' });

        try {
            // This endpoint is public, so it doesn't need credentials. This is correct.
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/submissions/run`, {
                code, language: 'cpp', problemId: id, input: inputToUse
            });
            setOutput(response.data.output);
            setVerdict({ type: 'neutral', message: 'Finished' });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An error occurred during execution.';
            setOutput(errorMessage);
            setVerdict({ type: 'error', message: 'Execution Error' });
        } finally {
            setLoading(prev => ({ ...prev, run: false }));
        }
    };

    const handleSubmit = async () => {
        setLoading(prev => ({ ...prev, submit: true }));
        setActiveConsoleTab('result');
        setOutput(null);
        setVerdict({ type: 'neutral', message: 'Submitting...' });
        const userId = localStorage.getItem("userId");

        if (!userId) { // We only need to check for userId now
            alert("Please login to submit your solution.");
            setLoading(prev => ({ ...prev, submit: false }));
            return;
        }

        try {
            // FIX: Removed the Authorization header and added withCredentials
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/submissions/submit`, 
            { code, language: 'cpp', problemId: id, userId }, 
            { withCredentials: true }); // This sends the cookie
            
            const { verdict: resultVerdict } = response.data;
            setOutput(`Verdict: ${resultVerdict}`);
            setVerdict({
                type: resultVerdict === 'Accepted' ? 'success' : 'error',
                message: resultVerdict
            });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Submission failed.';
            setOutput(errorMessage);
            setVerdict({ type: 'error', message: 'Submission Error' });
        } finally {
            setLoading(prev => ({ ...prev, submit: false }));
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset your code? This action cannot be undone.")) {
            setCode(defaultCode);
            localStorage.removeItem(getLocalStorageKey(id));
        }
    };

    const handleEditorChange = (value) => {
        setCode(value);
        localStorage.setItem(getLocalStorageKey(id), value);
    };

    const fetchComments = useCallback(async () => {
        try {
            // FIX: Removed the Authorization header and added withCredentials
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${id}`, {
                withCredentials: true
            });
            setComments(res.data);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    }, [id]);

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            // FIX: Added withCredentials to the request
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${id}`, 
            { content: newComment },
            { withCredentials: true });
            
            setNewComment("");
            fetchComments(); // Refresh comments list
        } catch (err) {
            console.error("Error posting comment:", err);
            alert("Failed to post comment.");
        }
    };

    const handleDescriptionTabClick = async (tabName) => {
        setActiveDescriptionTab(tabName);
        if (tabName === 'submissions') {
            const userId = localStorage.getItem("userId");
            if (!userId) return alert("Please login to view submissions.");
            
            setLoading(prev => ({ ...prev, submissions: true }));
            try {
                // FIX: Removed the Authorization header and added withCredentials
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/submissions/user/${userId}/problem/${id}`, {
                    withCredentials: true
                });
                setSubmissions(res.data);
            } catch (err) {
                console.error("Error fetching submissions:", err);
            } finally {
                setLoading(prev => ({ ...prev, submissions: false }));
            }
        }
        if (tabName === 'discussion') {
            fetchComments();
        }
    };

    const getResultStyles = () => {
        switch (verdict.type) {
            case 'success': return 'text-green-500';
            case 'error': return 'text-red-500';
            default: return 'text-slate-500 dark:text-slate-400';
        }
    };

    if (loading.page) return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
          
            <SkeletonLoader />
        </div>
    );

    const ProblemDescriptionContent = () => (
        <>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{problem?.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full 
                    ${problem?.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                    ${problem?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}
                    ${problem?.difficulty === 'Hard' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : ''}`}>
                    {problem?.difficulty}
                </span>
                {problem?.tags?.map((tag, idx) => (
                    <span key={idx} className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-500/10 px-2 py-1 rounded-full">
                        <Tag className="h-3 w-3" />{tag}
                    </span>
                ))}
            </div>

            <div className="prose prose-slate  dark:text-slate-100 dark:prose-invert max-w-none text-sm leading-relaxed">
                <p className='font-semibold text-lg'>{problem?.statement}</p>
                <h3 className="font-semibold text-slate-600 dark:text-slate-100">Constraints</h3>
                <pre className="whitespace-pre-line bg-slate-100 dark:text-slate-100 dark:bg-slate-800 p-3 rounded-md">{problem?.constraints}</pre>
                
                {problem?.testCases?.map((test, index) => (
                    <div key={index} className="mt-4">
                        <h3 className="font-semibold text-slate-600 dark:text-slate-400">Sample {index + 1}</h3>
                        <div className="space-y-2 bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                            <div>
                                <p className="font-medium text-slate-500 dark:text-slate-400">Input:</p>
                                <pre className="text-slate-800 dark:text-slate-200 font-mono">{test.input}</pre>
                            </div>
                            <div>
                                <p className="font-medium text-slate-500 dark:text-slate-400">Output:</p>
                                <pre className="text-slate-800 dark:text-slate-200 font-mono">{test.expectedOutput}</pre>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    const EditorialContent = () => (
        <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
            {problem?.editorial ? (
                <p>{problem.editorial}</p>
            ) : (
                <p>No editorial available for this problem yet.</p>
            )}
        </div>
    );

    const SubmissionsContent = () => (
        <div className="space-y-4">
            {loading.submissions ? (
                <p>Loading submissions...</p>
            ) : submissions.length === 0 ? (
                <p>No submissions found for this problem.</p>
            ) : (
                submissions.map((sub, idx) => (
                    <div key={idx} className="bg-slate-100 dark:text-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className={`font-bold text-sm ${sub.verdict === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                                {sub.verdict}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(sub.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-md p-2 relative group">
                            <pre className="text-xs overflow-x-auto">{sub.code}</pre>
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => navigator.clipboard.writeText(sub.code)} title="Copy Code" className="p-1.5 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">
                                    <Copy size={14} />
                                </button>
                                <button onClick={() => setCode(sub.code)} title="Load in Editor" className="p-1.5 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">
                                    <Replace size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    const DiscussionContent = () => (
        <div className="space-y-6">
            <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-grow p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 transition"
                />
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
                    <Send size={16} />
                </button>
            </form>
            <div className="space-y-4">
                {comments.length > 0 ? comments.map(comment => (
                    <div key={comment._id} className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-800 dark:text-slate-100">{comment.username}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{comment.content}</p>
                    </div>
                )) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No comments yet. Be the first to start a discussion!</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-slate-900 font-sans">
            
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                
                <Resizable
                    defaultSize={{ width: '50%', height: '100%' }}
                    minWidth="30%"
                    maxWidth="70%"
                    enable={{ right: true }}
                    className="hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/20"
                >
                    <div className="flex-shrink-0 p-2 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            <DescriptionTabButton name="Description" icon={<FileText size={16} />} active={activeDescriptionTab === 'description'} onClick={() => handleDescriptionTabClick('description')} />
                            <DescriptionTabButton name="Editorial" icon={<Lightbulb size={16} />} active={activeDescriptionTab === 'editorial'} onClick={() => handleDescriptionTabClick('editorial')} />
                            <DescriptionTabButton name="Discussion" icon={<MessageSquare size={16} />} active={activeDescriptionTab === 'discussion'} onClick={() => handleDescriptionTabClick('discussion')} />
                            <DescriptionTabButton name="Submissions" icon={<History size={16} />} active={activeDescriptionTab === 'submissions'} onClick={() => handleDescriptionTabClick('submissions')} />
                        </div>
                    </div>
                    <div className="overflow-y-auto p-6 flex-1">
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                            {activeDescriptionTab === 'description' && <ProblemDescriptionContent />}
                            {activeDescriptionTab === 'editorial' && <EditorialContent />}
                            {activeDescriptionTab === 'discussion' && <DiscussionContent />}
                            {activeDescriptionTab === 'submissions' && <SubmissionsContent />}
                        </motion.div>
                    </div>
                    {/* <div className="flex-shrink-0 p-2 flex items-center gap-4 border-t border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50">
                        <button className="flex items-center gap-1 text-slate-500 hover:text-green-500"><ThumbsUp size={16} /> <span className="text-xs">1.3k</span></button>
                        <button className="flex items-center gap-1 text-slate-500 hover:text-red-500"><ThumbsDown size={16} /></button>
                        <button className="flex items-center gap-1 text-slate-500 hover:text-yellow-500"><Star size={16} /></button>
                    </div> */}
                </Resizable>

                {/* Mobile view */}
                <div className="lg:hidden overflow-y-auto p-6 border-b border-slate-200 dark:border-slate-700">
                    <ProblemDescriptionContent />
                </div>


                <div className="flex flex-col flex-1 min-h-0 bg-slate-50 dark:bg-slate-900/70">
                    <Resizable
                        defaultSize={{ height: '60%', width: '100%' }}
                        minHeight="20%"
                        maxHeight="80%"
                        enable={{ bottom: true }}
                        className="flex flex-col min-h-0"
                    >
                        <div className="flex-shrink-0 flex items-center justify-between px-4 py-1 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                    C++ <ChevronDown className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleReset} title="Reset Code" className="p-2 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50" disabled={loading.run || loading.submit}>
                                    <RefreshCw className="h-4 w-4" />
                                </button>
                                <button title="Settings" className="p-2 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
                                    <Settings2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0">
                             <Editor
                                height="100%" language="cpp"
                                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                                value={code} onChange={handleEditorChange}
                                options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on', scrollBeyondLastLine: false }}
                            />
                        </div>
                    </Resizable>
                    
                    <div className="flex-1 flex flex-col min-h-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                         <div className="flex-shrink-0 px-4 pt-2">
                            <ConsoleTabButton name="Testcase" activeTab={activeConsoleTab} setActiveTab={setActiveConsoleTab} />
                            <ConsoleTabButton name="Result" activeTab={activeConsoleTab} setActiveTab={setActiveConsoleTab} />
                            <ConsoleTabButton name="Custom" activeTab={activeConsoleTab} setActiveTab={setActiveConsoleTab} />
                        </div>
                        
                        <div className="flex-grow p-4 overflow-y-auto">
                            {activeConsoleTab === 'testcase' && (
                                <div className="space-y-4">
                                    {problem?.testCases?.map((test, index) => (
                                        <div key={index}>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Case {index + 1}</p>
                                            <pre className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-sm">{test.input}</pre>
                                            <button onClick={() => handleRun(test.input)} disabled={loading.run || loading.submit} className="mt-2 text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed">
                                                Run on this case
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeConsoleTab === 'result' && (
                                <div>
                                    <p className={`text-lg font-semibold mb-2 flex items-center gap-2 ${getResultStyles()}`}>
                                        {verdict.type === 'success' && <CheckCircle />}
                                        {verdict.type === 'error' && <XCircle />}
                                        {loading.run || loading.submit ? <Loader2 className="animate-spin" /> : null}
                                        {verdict.message}
                                    </p>
                                    <pre className="whitespace-pre-wrap text-sm font-mono text-slate-700 dark:text-slate-300">
                                        {output || "// Run code or submit to see results here."}
                                    </pre>
                                </div>
                            )}
                            {activeConsoleTab === 'custom' && (
                                <textarea
                                    className="w-full h-full font-mono text-sm p-2 border rounded-md bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500 text-slate-800 dark:text-slate-200 resize-none"
                                    placeholder="Enter your custom input here..."
                                    value={customInput} onChange={(e) => setCustomInput(e.target.value)}
                                    disabled={loading.run || loading.submit}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center justify-end gap-3 p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                        <ActionButton
                            onClick={() => handleRun(customInput)}
                            disabled={loading.run || loading.submit}
                            loading={loading.run}
                            text="Run Code"
                            icon={<Play className="h-4 w-4" />}
                            variant="secondary"
                        />
                        <ActionButton
                            onClick={handleSubmit}
                            disabled={loading.run || loading.submit}
                            loading={loading.submit}
                            text="Submit"
                            icon={<Upload className="h-4 w-4" />}
                            variant="primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemDetail;
