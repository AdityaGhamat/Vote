import React, { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";

const Results = () => {
  const { contract, phase } = useWeb3();
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (contract && phase === 2) {
      fetchWinner();
    }
  }, [contract, phase]);

  const fetchWinner = async () => {
    try {
      const winnerData = await contract.getWinner();
      setWinner({
        id: winnerData[0].toNumber(),
        name: winnerData[1],
        party: winnerData[2],
        votes: winnerData[3].toNumber(),
      });
    } catch (error) {
      console.error("Error fetching winner:", error);
    }
  };

  return (
    <div className="results-page">
      <h2>Election Results</h2>
      {phase !== 2 ? (
        <p>Results will be available once the election has ended.</p>
      ) : winner ? (
        <div>
          <h3>Winner: {winner.name}</h3>
          <p>Party: {winner.party}</p>
          <p>Votes Received: {winner.votes}</p>
        </div>
      ) : (
        <p>No winner declared yet.</p>
      )}
    </div>
  );
};

export default Results;
