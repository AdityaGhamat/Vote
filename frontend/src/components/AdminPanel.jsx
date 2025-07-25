import React, { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";

const AdminPanel = () => {
  const { contract, isAdmin, phase } = useWeb3();
  const [pendingContestants, setPendingContestants] = useState([]);
  const [pendingVoters, setPendingVoters] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      loadPendingRequests();
    }
  }, [contract, isAdmin]);

  const loadPendingRequests = async () => {
    if (!contract) return;

    try {
      const pendingAddresses = Object.keys(await contract.pendingContestants());
      const pendingContestantsList = await Promise.all(
        pendingAddresses.map(async (address) => {
          const data = await contract.pendingContestants(address);
          return { address, ...data };
        })
      );

      const pendingVotersList = Object.keys(await contract.pendingRequests());

      setPendingContestants(pendingContestantsList);
      setPendingVoters(pendingVotersList);
    } catch (error) {
      console.error("Error loading pending requests:", error);
    }
  };

  const handlePhaseChange = async (newPhase) => {
    try {
      const tx = await contract.changeState(newPhase);
      await tx.wait();
      alert("Phase changed successfully!");
    } catch (error) {
      console.error("Error changing phase:", error);
      alert("Error changing phase");
    }
  };

  const approveContestant = async (address) => {
    try {
      const tx = await contract.approveContestant(address);
      await tx.wait();
      alert("Contestant approved successfully!");
      loadPendingRequests();
    } catch (error) {
      console.error("Error approving contestant:", error);
      alert("Error approving contestant");
    }
  };

  const approveVoter = async (address) => {
    try {
      const tx = await contract.approveVoterRegistration(address);
      await tx.wait();
      alert("Voter approved successfully!");
      loadPendingRequests();
    } catch (error) {
      console.error("Error approving voter:", error);
      alert("Error approving voter");
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      <div>
        <h3>Change Phase</h3>
        <button onClick={() => handlePhaseChange(0)} disabled={phase === 0}>
          Registration
        </button>
        <button onClick={() => handlePhaseChange(1)} disabled={phase === 1}>
          Voting
        </button>
        <button onClick={() => handlePhaseChange(2)} disabled={phase === 2}>
          Ended
        </button>
      </div>

      <div>
        <h3>Approve Contestants</h3>
        {pendingContestants.length === 0 ? (
          <p>No pending contestants</p>
        ) : (
          pendingContestants.map((contestant, index) => (
            <div key={index}>
              <p>
                {contestant.name} ({contestant.party})
              </p>
              <button onClick={() => approveContestant(contestant.address)}>
                Approve
              </button>
            </div>
          ))
        )}
      </div>

      <div>
        <h3>Approve Voters</h3>
        {pendingVoters.length === 0 ? (
          <p>No pending voters</p>
        ) : (
          pendingVoters.map((voter, index) => (
            <div key={index}>
              <p>{voter}</p>
              <button onClick={() => approveVoter(voter)}>Approve</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
