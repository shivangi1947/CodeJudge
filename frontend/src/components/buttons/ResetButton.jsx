import React from 'react';

const ResetButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Reset
    </button>
  );
};

export default ResetButton;
