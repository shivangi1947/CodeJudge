import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProblemForm = ({ onSubmit, initialData = {}, isSaving }) => {
    const [formData, setFormData] = useState({
        title: '',
        statement: '',
        difficulty: 'Easy',
        tags: '',
        constraints: '',
        boilerplate: '#include <iostream>\n\nint main() {\n    // Your C++ code here\n    return 0;\n}',
        testCases: [{ input: '', expectedOutput: '', isHidden: false }],
        timeLimit: 2000,
        memoryLimit: 256
    });

    useEffect(() => {
        if (initialData._id) { // Check if we are in "edit" mode
            setFormData({
                title: initialData.title || '',
                statement: initialData.statement || '',
                difficulty: initialData.difficulty || 'Easy',
                tags: initialData.tags?.join(', ') || '',
                constraints: initialData.constraints || '',
                boilerplate: initialData.boilerplate || '',
                testCases: initialData.testCases?.length > 0 ? initialData.testCases : [{ input: '', expectedOutput: '', isHidden: false }],
                timeLimit: initialData.timeLimit || 2000,
                memoryLimit: initialData.memoryLimit || 256
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTestCaseChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const newTestCases = [...formData.testCases];
        newTestCases[index][name] = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, testCases: newTestCases }));
    };

    const addTestCase = () => {
        setFormData(prev => ({
            ...prev,
            testCases: [...prev.testCases, { input: '', expectedOutput: '', isHidden: false }]
        }));
    };

    const removeTestCase = (index) => {
        const newTestCases = formData.testCases.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, testCases: newTestCases }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert numbers and tags string to array before submitting
        const dataToSubmit = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            timeLimit: parseInt(formData.timeLimit, 10),
            memoryLimit: parseInt(formData.memoryLimit, 10)
        };
        onSubmit(dataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-slate-900 dark:text-white">
            <div>
                <label htmlFor="title" className="block text-sm font-medium">Title</label>
                <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
                <label htmlFor="statement" className="block text-sm font-medium">Problem Statement</label>
                <textarea name="statement" id="statement" rows="5" required value={formData.statement} onChange={handleChange} className="mt-1 block w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-emerald-500 focus:border-emerald-500"></textarea>
            </div>
            
            {/* 👇 SECTION ADDED for CONSTRAINTS 👇 */}
            <div>
                <label htmlFor="constraints" className="block text-sm font-medium">Constraints</label>
                <textarea name="constraints" id="constraints" rows="3" required value={formData.constraints} onChange={handleChange} className="mt-1 block w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-emerald-500 focus:border-emerald-500"></textarea>
            </div>

            {/* 👇 SECTION ADDED for BOILERPLATE CODE 👇 */}
            <div>
                <label htmlFor="boilerplate" className="block text-sm font-medium">Boilerplate Code (C++)</label>
                <textarea name="boilerplate" id="boilerplate" rows="5" required value={formData.boilerplate} onChange={handleChange} className="mt-1 block w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent font-mono text-sm"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium">Difficulty</label>
                    <select name="difficulty" id="difficulty" value={formData.difficulty} onChange={handleChange} className="mt-1 block w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-emerald-500 focus:border-emerald-500">
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="tags" className="block text-sm font-medium">Tags (comma-separated)</label>
                    <input type="text" name="tags" id="tags" value={formData.tags} onChange={handleChange} className="mt-1 block w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                 <div>
                    <label htmlFor="timeLimit" className="block text-sm font-medium">Time Limit (ms)</label>
                    <input type="number" name="timeLimit" id="timeLimit" required value={formData.timeLimit} onChange={handleChange} className="mt-1 block w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                 <div>
                    <label htmlFor="memoryLimit" className="block text-sm font-medium">Memory Limit (KB)</label>
                    <input type="number" name="memoryLimit" id="memoryLimit" required value={formData.memoryLimit} onChange={handleChange} className="mt-1 block w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
            </div>

            {/* Test Cases */}
            <div>
                <h3 className="text-lg font-medium mb-2">Test Cases</h3>
                {formData.testCases.map((tc, index) => (
                    <div key={index} className="space-y-2 border border-slate-200 dark:border-slate-700 p-4 rounded-md mb-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Input</label>
                                <textarea name="input" rows="3" required value={tc.input} onChange={(e) => handleTestCaseChange(index, e)} className="mt-1 block w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent"></textarea>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Expected Output</label>
                                <textarea name="expectedOutput" rows="3" required value={tc.expectedOutput} onChange={(e) => handleTestCaseChange(index, e)} className="mt-1 block w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent"></textarea>
                            </div>
                        </div>
                         <div className="flex items-center mt-2">
                            <input type="checkbox" name="isHidden" id={`isHidden-${index}`} checked={tc.isHidden} onChange={(e) => handleTestCaseChange(index, e)} className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500" />
                            <label htmlFor={`isHidden-${index}`} className="ml-2 block text-sm">Hidden Test Case</label>
                        </div>
                        {formData.testCases.length > 1 && (
                            <button type="button" onClick={() => removeTestCase(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><X size={18} /></button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addTestCase} className="mt-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500">
                    + Add Test Case
                </button>
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Problem'}
                </button>
            </div>
        </form>
    );
};

export default ProblemForm;