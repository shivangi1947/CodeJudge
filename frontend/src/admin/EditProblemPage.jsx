import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ProblemForm from '../components/admin/ProblemForm';
// import Navbar from '../../components/layout/Navbar';
import { Loader2 } from 'lucide-react';

const EditProblemPage = () => {
    const { id } = useParams(); // Get problem ID from URL
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/problems/${id}`,
                    { withCredentials: true }
                );
                setProblem(res.data);
            } catch (err) {
                setError('Failed to fetch problem data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id]);

    const handleUpdateProblem = async (formData) => {
        setIsSaving(true);
        setError('');
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/problems/${id}`,
                formData,
                { withCredentials: true }
            );
            navigate('/admin'); // Redirect to admin dashboard on success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update problem.');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8" /></div>;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* <Navbar /> */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Edit Problem</h1>
                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md mb-4">{error}</div>}
                {problem && (
                    <ProblemForm 
                        onSubmit={handleUpdateProblem} 
                        initialData={problem}
                        isSaving={isSaving} 
                    />
                )}
            </main>
        </div>
    );
};

export default EditProblemPage;