import React from 'react';

const SubmitButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      Submit
    </button>
  );
};

export default SubmitButton;
