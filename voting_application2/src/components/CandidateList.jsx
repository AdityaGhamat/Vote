import React from "react";

const CandidateList = ({ candidates, onVote }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Candidates</h2>
      <ul>
        {candidates.map((candidate) => (
          <li
            key={candidate.id}
            className="flex justify-between bg-gray-100 p-4 mb-2"
          >
            <div>
              <p>
                <strong>Name:</strong> {candidate.name}
              </p>
              <p>
                <strong>Party:</strong> {candidate.party}
              </p>
              <p>
                <strong>Votes:</strong> {candidate.voteCount}
              </p>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => onVote(candidate.id)}
            >
              Vote
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidateList;
