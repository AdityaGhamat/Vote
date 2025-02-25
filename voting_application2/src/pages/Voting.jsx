import React, { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";

const Voting = () => {
  const { contract, account, phase } = useWeb3();
  const [contestants, setContestants] = useState([]);
  const [selectedContestant, setSelectedContestant] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [contestantDetails, setContestantDetails] = useState({});

  useEffect(() => {
    if (contract) {
      loadContestants();
      checkVotingStatus();
    }
  }, [contract]);

  const loadContestants = async () => {
    try {
      const count = await contract.contestantsCount();
      const contestantList = [];
      for (let i = 1; i <= count; i++) {
        const contestant = await contract.contestants(i);
        const walletAddress = contestant.walletAddress; // Ensure correct extraction
        contestantList.push({ id: i, walletAddress, ...contestant });

        // Fetch additional details for each contestant
        fetchContestantDetails(walletAddress);
      }
      setContestants(contestantList);
    } catch (error) {
      console.error("Error fetching contestants:", error);
    }
  };

  const fetchContestantDetails = async (walletAddress) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/contestant/detail?walletAddress=${walletAddress}`
      );
      const data = await response.json();

      if (data.success) {
        setContestantDetails((prevDetails) => ({
          ...prevDetails,
          [walletAddress]: {
            ...data.data,
            candidateImage:
              data.data.candidateImage || "/default-candidate.png",
            partyImage: data.data.partyImage || "/default-party.png",
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching contestant details:", error);
    }
  };

  const checkVotingStatus = async () => {
    try {
      const voted = await contract.hasVoted(account);
      setHasVoted(voted);
    } catch (error) {
      console.error("Error checking voting status:", error);
    }
  };

  const castVote = async () => {
    if (!selectedContestant) {
      alert("Please select a contestant to vote for.");
      return;
    }

    try {
      const tx = await contract.vote(selectedContestant);
      await tx.wait();
      alert("Vote cast successfully!");
      setHasVoted(true);
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("Error casting vote");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Voting</h2>
      {phase !== 1 ? (
        <p className="text-gray-600">Voting is not active.</p>
      ) : hasVoted ? (
        <p className="text-green-600 font-medium">You have already voted.</p>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-4">Select a Contestant</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {contestants.map((contestant) => {
              const details = contestantDetails[contestant.walletAddress];
              return (
                <div
                  key={contestant.id}
                  className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                    selectedContestant === contestant.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <label className="flex flex-col cursor-pointer p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="radio"
                        name="contestant"
                        value={contestant.id}
                        onChange={() => setSelectedContestant(contestant.id)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-lg font-medium">
                        {contestant.name} ({contestant.party})
                      </span>
                    </div>

                    {details ? (
                      <div className="flex flex-col">
                        <div className="flex space-x-4 mb-4">
                          <div className="flex-shrink-0">
                            <img
                              src={details.candidateImage}
                              alt={details.name}
                              className="w-24 h-24 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-shrink-0">
                            <img
                              src={details.partyImage}
                              alt={details.party}
                              className="w-16 h-16 object-contain"
                            />
                          </div>
                        </div>
                        <div className="space-y-1 text-gray-700">
                          <p>
                            <span className="font-medium">Name:</span>{" "}
                            {details.name}
                          </p>
                          <p>
                            <span className="font-medium">Party:</span>{" "}
                            {details.party}
                          </p>
                          <p>
                            <span className="font-medium">Age:</span>{" "}
                            {details.age}
                          </p>
                          <p>
                            <span className="font-medium">Qualification:</span>{" "}
                            {details.qualification}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 px-2 text-gray-500">
                        <div className="animate-pulse flex space-x-4">
                          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                        <p className="mt-2">Loading details...</p>
                      </div>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
          <button
            onClick={castVote}
            disabled={!selectedContestant}
            className={`px-6 py-2 rounded-md text-white font-medium ${
              !selectedContestant
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            }`}
          >
            Cast Your Vote
          </button>
        </>
      )}
    </div>
  );
};

export default Voting;
