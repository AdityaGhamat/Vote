import React, { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import axios from "axios";
const AdminPanel = () => {
  const { contract, isAdmin } = useWeb3();
  const [pendingContestants, setPendingContestants] = useState([]);
  const [pendingVoters, setPendingVoters] = useState([]);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contract || !isAdmin) return;

    const loadCurrentPhase = async () => {
      try {
        const phase = await contract.state();
        setCurrentPhase(Number(phase));
      } catch (error) {
        console.error("Error loading phase:", error);
        setError("Failed to load current phase");
      }
    };

    loadCurrentPhase();
    loadPendingRequests();

    // Set up event listeners
    const contestantFilter = contract.filters.ContestantRequested();
    const voterFilter = contract.filters.VoterRequested();
    const phaseFilter = contract.filters.PhaseChanged();

    contract.on(contestantFilter, () => loadPendingRequests());
    contract.on(voterFilter, () => loadPendingRequests());
    contract.on(phaseFilter, (newPhase) => setCurrentPhase(Number(newPhase)));

    return () => {
      contract.off(contestantFilter);
      contract.off(voterFilter);
      contract.off(phaseFilter);
    };
  }, [contract, isAdmin]);

  const loadPendingRequests = async () => {
    if (!contract) return;
    setLoading(true);
    setError("");
    try {
      const contestantFilter = contract.filters.ContestantRequested();
      const voterFilter = contract.filters.VoterRequested();

      const contestantEvents = await contract.queryFilter(contestantFilter);
      const voterEvents = await contract.queryFilter(voterFilter);

      // Process contestant requests
      const contestants = await Promise.all(
        contestantEvents.map(async (event) => {
          const walletAddress = event.args.requester.toLowerCase();
          const request = await contract.pendingContestants(walletAddress);

          // Fetch additional contestant details from your API
          let candidateData = {};
          try {
            const response = await axios.get(
              `http://localhost:5000/api/v1/contestant/detail?walletAddress=${walletAddress}`
            );
            const result = response.data;
            if (result.success) {
              candidateData = result.data;
            }
          } catch (error) {
            console.error("Error fetching contestant details:", error);
          }

          return {
            address: walletAddress,
            name: request.name || candidateData.name,
            party: request.party || candidateData.party,
            age: request.age.toString() || candidateData.age,
            qualification: request.qualification || candidateData.qualification,
            exists: request.exists,
            partyImage: candidateData.partyImage || "",
            candidateImage: candidateData.candidateImage || "",
          };
        })
      );

      // Process voter requests
      const voters = await Promise.all(
        voterEvents.map(async (event) => {
          const walletAddress = event.args.requester;
          const request = await contract.pendingVoterRequests(walletAddress);
          return {
            address: walletAddress,
            name: request.name,
            voterId: request.voterId,
            phoneNumber: request.phoneNumber,
            aadhaarNumber: request.aadhaarNumber,
            exists: request.exists,
          };
        })
      );

      setPendingContestants(contestants.filter((c) => c.exists));
      setPendingVoters(voters.filter((v) => v.exists));
    } catch (error) {
      console.error("Error loading pending requests:", error);
      setError("Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  };

  const handlePhaseChange = async (newPhase) => {
    try {
      setLoading(true);
      setError("");
      const tx = await contract.changeState(newPhase);
      await tx.wait();
      setCurrentPhase(newPhase);
      alert("Phase changed successfully!");
    } catch (error) {
      console.error("Error changing phase:", error);
      setError("Failed to change phase");
    } finally {
      setLoading(false);
    }
  };

  const approveContestant = async (address) => {
    try {
      setLoading(true);
      setError("");
      const tx = await contract.approveContestant(address);
      await tx.wait();
      alert("Contestant approved successfully!");
      await loadPendingRequests(); // Reload the requests after approval
    } catch (error) {
      console.error("Error approving contestant:", error);
      setError("Failed to approve contestant");
    } finally {
      setLoading(false);
    }
  };

  const approveVoter = async (address) => {
    try {
      setLoading(true);
      setError("");
      const tx = await contract.approveVoterRegistration(address);
      await tx.wait();
      alert("Voter approved successfully!");
      await loadPendingRequests(); // Reload the requests after approval
    } catch (error) {
      console.error("Error approving voter:", error);
      setError("Failed to approve voter");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-2 text-gray-600">
          Only the admin can access this panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Phase Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Election Phase Management</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              Current Phase:{" "}
              {currentPhase === 0
                ? "Registration"
                : currentPhase === 1
                ? "Voting"
                : "Ended"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handlePhaseChange(0)}
              disabled={loading || currentPhase === 0}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Set Registration
            </button>
            <button
              onClick={() => handlePhaseChange(1)}
              disabled={loading || currentPhase === 1}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              Start Voting
            </button>
            <button
              onClick={() => handlePhaseChange(2)}
              disabled={loading || currentPhase === 2}
              className="p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              End Election
            </button>
          </div>
        </div>
      </div>

      {/* Pending Contestants Section */}
      {/* Pending Contestants Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Pending Contestants</h2>
        {loading ? (
          <p>Loading...</p>
        ) : pendingContestants.length === 0 ? (
          <p className="text-gray-600">No pending contestant requests</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingContestants.map((contestant) => (
              <div
                key={contestant.address}
                className="border p-4 rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition-shadow"
              >
                {/* Candidate & Party Images */}
                <div className="flex items-center space-x-4 mb-4">
                  {contestant.candidateImage && (
                    <img
                      src={contestant.candidateImage}
                      alt={`${contestant.name}'s image`}
                      className="w-16 h-16 object-cover rounded-full border-2 border-gray-300"
                    />
                  )}
                  {contestant.partyImage && (
                    <img
                      src={contestant.partyImage}
                      alt={`${contestant.party} Logo`}
                      className="w-12 h-12 object-cover rounded-md border border-gray-300"
                    />
                  )}
                </div>

                {/* Contestant Details */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {contestant.name}
                </h3>
                <p className="text-gray-600">
                  <span className="font-medium">Party:</span> {contestant.party}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Age:</span> {contestant.age}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Qualification:</span>{" "}
                  {contestant.qualification}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  <span className="font-medium">Wallet:</span>{" "}
                  {contestant.address}
                </p>

                {/* Approve Button */}
                <button
                  onClick={() => approveContestant(contestant.address)}
                  disabled={loading}
                  className="mt-4 w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Voters Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Pending Voters</h2>
        {loading ? (
          <p>Loading...</p>
        ) : pendingVoters.length === 0 ? (
          <p className="text-gray-600">No pending voter requests</p>
        ) : (
          <div className="space-y-4">
            {pendingVoters.map((voter) => (
              <div key={voter.address} className="border p-4 rounded">
                <p className="font-semibold">{voter.name}</p>
                <p className="text-gray-600">Voter ID: {voter.voterId}</p>
                <p className="text-gray-600">Phone: {voter.phoneNumber}</p>
                <p className="text-gray-600">Aadhaar: {voter.aadhaarNumber}</p>
                <p className="text-sm text-gray-500">
                  Address: {voter.address}
                </p>
                <button
                  onClick={() => approveVoter(voter.address)}
                  disabled={loading}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
