import React, { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";

const Home = () => {
  const { contract, account, phase } = useWeb3();
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    if (contract) loadCandidates();
  }, [contract]);

  const loadCandidates = async () => {
    try {
      const count = await contract.contestantsCount();
      let tempCandidates = [];
      for (let i = 1; i <= count; i++) {
        const contestant = await contract.contestants(i);
        tempCandidates.push({
          id: contestant.id,
          name: contestant.name,
          voteCount: Number(contestant.voteCount),
        });
      }
      setCandidates(tempCandidates);
    } catch (error) {
      console.error("Error loading candidates:", error);
    }
  };

  const castVote = async (id) => {
    try {
      const tx = await contract.vote(id);
      await tx.wait();
      alert("Vote cast successfully!");
      loadCandidates();
    } catch (error) {
      alert("Error voting: " + error.message);
    }
  };

  return (
    <div>
      <h2>Vote for Your Candidate</h2>
      {phase !== 1 ? (
        <p>Voting is not active</p>
      ) : (
        candidates.map((candidate) => (
          <div key={candidate.id}>
            <p>
              {candidate.name} - {candidate.voteCount} votes
            </p>
            <button onClick={() => castVote(candidate.id)}>Vote</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
