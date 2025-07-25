import React, { useEffect, useState } from "react";
import axios from "axios";
import ProblemCard from "./ProblemCard"; // reusable card with "Solve Now"
import { useNavigate } from "react-router-dom";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signup"); 
      return;
    }

    const fetchProblems = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problems`);
        setProblems(res.data);
      } 
      
      catch (err) {
        console.error("Error fetching problems:", err);
        if (err.response?.status === 401) {
          navigate("/login"); 
        }
      }
    };

    fetchProblems();
  }, [navigate]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Problem List</h1>
      <div className="grid gap-4">
        {problems.map((problem) => (
          <ProblemCard key={problem._id} problem={problem} />
        ))}
      </div>
    </div>
  );
};

export default ProblemList;
