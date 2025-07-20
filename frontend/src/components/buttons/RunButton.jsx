import React from 'react';

const RunButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Run
    </button>
  );
};

export default RunButton;
