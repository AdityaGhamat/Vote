import React from "react";

const VoteButton = ({ onClick }) => {
  return (
    <button
      className="bg-green-500 text-white px-4 py-2 rounded"
      onClick={onClick}
    >
      Vote
    </button>
  );
};

export default VoteButton;
