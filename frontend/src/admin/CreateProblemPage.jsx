import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProblemForm from '../components/admin/ProblemForm';
// import Navbar from '../../components/layout/Navbar';

const CreateProblemPage = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const handleCreateProblem = async (formData) => {
        setIsSaving(true);
        setError('');
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/problems`,
                formData,
                { withCredentials: true }
            );
            navigate('/admin'); // Redirect to admin dashboard on success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create problem.');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* <Navbar /> */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Create New Problem</h1>
                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md mb-4">{error}</div>}
                <ProblemForm onSubmit={handleCreateProblem} isSaving={isSaving} />
            </main>
        </div>
    );
};

export default CreateProblemPage;