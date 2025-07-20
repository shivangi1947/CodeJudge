// src/components/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-4">
        Welcome to CodeJudge ! 
      </h1>
      <p className="text-gray-600 text-lg mb-8">
        Practice coding problems, run and submit your code, and track your progress.
        (Work in Progress.Sorry for poor aesthetics.)
      </p>
      <div className="flex gap-4">
        <Link to="/login">
          <button className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-6 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-100 transition">
            Sign Up
          </button>
        </Link>
        <Link to="/problems">
          <button className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition">
            Explore Problems
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
