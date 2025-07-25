import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserSubmissions = () => {
  const { problemId, userId } = useParams();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/submissions/user/${userId}/problem/${problemId}`);
        setSubmissions(res.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };

    fetchSubmissions();
  }, [problemId, userId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-purple-700">Your Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((submission, idx) => (
            <li key={idx} className="border p-4 rounded bg-gray-50">
              <p><strong>Verdict:</strong> {submission.verdict}</p>
              <p><strong>Submitted At:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
              <pre className="bg-gray-100 p-2 mt-2 rounded text-sm overflow-x-auto">{submission.code}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSubmissions;
