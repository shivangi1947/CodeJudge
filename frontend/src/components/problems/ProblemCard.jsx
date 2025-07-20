// src/components/problems/ProblemCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProblemCard = ({ problem }) => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-xl shadow-md mb-4 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">{problem.title}</h2>

      <div className="mt-2 mb-3">
        {problem.tags?.map((tag, idx) => (
          <span
            key={idx}
            className="inline-block bg-gray-600 text-sm px-3 py-1 rounded-full mr-2 mb-1"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* <p className="text-sm mb-4 whitespace-pre-line line-clamp-2">{problem.statement}</p> */}

      <div className="flex justify-between items-center text-sm">
        <span
          className={`${
            problem.difficulty === "EASY"
              ? "text-green-400"
              : problem.difficulty === "MEDIUM"
              ? "text-yellow-400"
              : "text-red-400"
          } font-medium`}
        >
          {problem.difficulty}
        </span>

        <Link
          to={`/probdetail/${problem._id}`}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm"
        >
          Solve Now
        </Link>
      </div>
    </div>
  );
};

export default ProblemCard;
