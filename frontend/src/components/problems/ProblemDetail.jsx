import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import RunButton from '../buttons/RunButton';
import SubmitButton from '../buttons/SubmitButton';
import ResetButton from '../buttons/ResetButton';
import { useNavigate } from 'react-router-dom';
//import ViewSub from '../buttons/ViewSub';

// import jwt_decode from "jwt-decode";




const ProblemDetail = () => {

  const defaultCode = `#include<bits/stdc++.h>
using namespace std;

int main() {
    // your code goes here
    return 0;
}`;
  
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('// Your output will appear here');
  const [customInput, setCustomInput] = useState('');

  const handleRun = async () => {
    
    try 
    
    {
        const response = await axios.post('http://localhost:5000/api/submissions/run', {
        code,
        language: 'cpp',
        problemId: id,
        input: customInput
        });
        setOutput(response.data.output);
   } 
  
  catch (error) 
    {
        setOutput('Error during execution');
        console.error(error);
    }
  };

  const handleSubmit = async () => {

    console.log({ code, language: 'cpp', problemId: id, userId: localStorage.getItem('userId') });
    const userId = localStorage.getItem("userId");
   
   try {
    const response = await axios.post('/api/submissions/submit', {
      code,
      language: 'cpp',
      problemId: id, 
      userId
    });

    setOutput(response.data.verdict); // or show "Passed", "Failed", etc.
  } catch (error) {
    setOutput('Submission failed');
    console.error("Submit error:", error);
  }
  };

  const handleReset = () => {
    
    

    setCode(defaultCode);
    setCustomInput('');
    setOutput('');
    
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`/api/problems/${id}`);
       
        setProblem(res.data);
      } catch (err) {
        console.error('Failed to fetch problem:', err);
      }
    };

    fetchProblem();
  }, [id]);

  const navigate = useNavigate(); 

const handleViewSubmissions = () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return alert("Please login to view submissions.");
  navigate(`/submissions/${id}/${userId}`);
};

  const handleEditorChange = (value) => setCode(value);
  const handleInputChange = (e) => setCustomInput(e.target.value);

  if (!problem) return <div className="p-4">Loading...</div>;

  return (
   <div className="grid grid-cols-1 md:grid-cols-2 flex-grow">

      {/* Left Panel: Problem Description */}
      <div className="overflow-y-auto p-6 bg-gray-50 border-r">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">{problem.title}</h1>

        <div className="mb-4 text-gray-800 whitespace-pre-line">
          <h2 className="font-semibold text-lg mb-1">Problem Statement</h2>
          <p>{problem.statement}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-lg">Constraints</h2>
          <p className="whitespace-pre-line text-sm text-gray-700">{problem.constraints}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-lg">Difficulty</h2>
          <span className="inline-block bg-indigo-200 text-indigo-800 text-sm px-2 py-1 rounded">
            {problem.difficulty}
          </span>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-lg">Tags</h2>
          <div className="flex flex-wrap gap-2 mt-1">
            {problem.tags?.map((tag, idx) => (
            <span key={idx} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                {tag}
            </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-1">Sample Test Cases</h2>
          {problem.testCases?.map((test, index) => (
            <div key={index} className="mb-2 p-2 border rounded bg-white text-sm">
              <p><span className="font-semibold">Input:</span> <pre className="inline">{test.input}</pre></p>
              <p><span className="font-semibold">Expected Output:</span> <pre className="inline">{test.expectedOutput}</pre></p>
            </div>
          ))}
        </div>

        <button
          onClick={handleViewSubmissions}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
          View Your Submissions
        </button>
      </div>

      


      
            

      {/* Right Panel: Editor and Output */}
      
        <div className="flex flex-col h-full">
        {/* Scrollable Editor Section */}
        <div className="flex-1 overflow-y-auto border-b p-2">
            <Editor
            height="500px" // optional: gives visible area
            defaultLanguage="cpp"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: 'on',
            }}
            />
        </div>

        {/* Buttons Row (Fixed) */}
        <div className="flex gap-4 px-4 py-2 bg-gray-100 border-t justify-start">
            <RunButton onClick={handleRun} />
            <SubmitButton onClick={handleSubmit} />
            <ResetButton onClick={handleReset} />
        </div>

        {/* Output Section (Fixed) */}
        <div className="h-40 p-2 bg-gray-100 border-t flex flex-col">
            <h2 className="text-sm font-semibold mb-1">Program Output</h2>
            <div className="bg-white p-2 rounded border h-full overflow-y-auto font-mono text-sm text-gray-800">
            <p>{output || "// Output will be shown here"}</p>
            </div>
        </div>

        {/* Custom Input Section (Fixed) */}
        <div className="h-32 p-2 bg-gray-50 border-t flex flex-col">
            <h2 className="text-sm font-semibold mb-1">Custom Input</h2>
            <textarea
            className="w-full h-full font-mono text-sm p-2 border rounded-md"
            placeholder="Enter custom input here"
            value={customInput}
            onChange={handleInputChange}
            />
        </div>
        </div>

    </div>
  );
};

export default ProblemDetail;
