import React, { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { useFirebase } from "../context/FirebaseContext";
import axios from "axios";

const Registration = () => {
  const { contract, account } = useWeb3();
  const { requestOTP, verifyOTP, otpSent } = useFirebase();

  const [contestantForm, setContestantForm] = useState({
    name: "",
    party: "",
    age: "",
    qualification: "",
    walletAddress: "",
  });

  const [partyImage, setPartyImage] = useState(null);
  const [candidateImage, setCandidateImage] = useState(null);

  const [voterForm, setVoterForm] = useState({
    voterId: account,
    phoneNumber: "",
    name: "",
    aadhaarNumber: "",
  });

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  const handleRequestOTP = async () => {
    if (!voterForm.phoneNumber) {
      alert("Please enter a phone number first");
      return;
    }
    setIsRequestingOTP(true);
    try {
      const response = await requestOTP(voterForm.phoneNumber, account);
      if (response.success) {
        setShowOTP(true);
        alert("Otp has been sent");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsRequestingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    setIsVerifyingOTP(true);
    try {
      const response = await verifyOTP(voterForm.phoneNumber, account, otp);
      if (response.success) {
        setIsPhoneVerified(true);
        alert("Otp has been verified");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleContestantSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.requestToContest(
        contestantForm.name,
        contestantForm.party,
        parseInt(contestantForm.age),
        contestantForm.qualification
      );
      await tx.wait();

      // Create form data for image upload
      const formData = new FormData();
      formData.append("partyImage", partyImage);
      formData.append("candidateImage", candidateImage);
      formData.append("name", contestantForm.name);
      formData.append("party", contestantForm.party);
      formData.append("age", contestantForm.age);
      formData.append("qualification", contestantForm.qualification);
      formData.append("walletAddress", account);

      // Send to backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/contestant`,
        formData
      );

      if (response.status === 201) {
        alert("Contestant data saved successfully!");

        // Reset form
        setContestantForm({
          name: "",
          party: "",
          age: "",
          qualification: "",
        });
        setPartyImage(null);
        setCandidateImage(null);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting contestant request");
    }
  };

  const handleVoterSubmit = async (e) => {
    e.preventDefault();
    if (!isPhoneVerified) {
      alert("Please verify your phone number first");
      return;
    }
    try {
      const tx = await contract.requestVoterRegistration(
        voterForm.voterId,
        voterForm.phoneNumber,
        voterForm.name,
        voterForm.aadhaarNumber
      );
      await tx.wait();
      alert("Voter registration request submitted!");
      setVoterForm({
        voterId: "",
        phoneNumber: "",
        name: "",
        aadhaarNumber: "",
      });
      setIsPhoneVerified(false);
      setOTP("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error requesting voter registration");
    }
  };

  return (
    <div className="space-y-8">
      {/* Contestant Registration Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Request to Contest</h2>
        <form onSubmit={handleContestantSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={contestantForm.name}
            onChange={(e) =>
              setContestantForm({ ...contestantForm, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Party"
            className="w-full p-2 border rounded"
            value={contestantForm.party}
            onChange={(e) =>
              setContestantForm({ ...contestantForm, party: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Age"
            className="w-full p-2 border rounded"
            value={contestantForm.age}
            onChange={(e) =>
              setContestantForm({ ...contestantForm, age: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Qualification"
            className="w-full p-2 border rounded"
            value={contestantForm.qualification}
            onChange={(e) =>
              setContestantForm({
                ...contestantForm,
                qualification: e.target.value,
              })
            }
            required
          />

          <div>
            <label className="block text-gray-700 font-medium">
              Party Image:
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded"
              onChange={(e) => setPartyImage(e.target.files[0])}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Candidate Image:
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded"
              onChange={(e) => setCandidateImage(e.target.files[0])}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Submit Contestant Request
          </button>
        </form>
      </div>

      {/* Voter Registration Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Voter Registration</h2>
        <form onSubmit={handleVoterSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Voter ID"
            className="w-full p-2 border rounded"
            value={voterForm.voterId}
            onChange={(e) =>
              setVoterForm({ ...voterForm, voterId: e.target.value })
            }
            required
          />

          {/* Phone number verification section */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="Phone Number"
                className="flex-1 p-2 border rounded"
                value={voterForm.phoneNumber}
                onChange={(e) =>
                  setVoterForm({ ...voterForm, phoneNumber: e.target.value })
                }
                disabled={isPhoneVerified}
                required
              />
              <button
                type="button"
                onClick={handleRequestOTP}
                className={`px-4 py-2 rounded ${
                  isPhoneVerified
                    ? "bg-green-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
                disabled={
                  isPhoneVerified || isRequestingOTP || !voterForm.phoneNumber
                }
              >
                {isRequestingOTP
                  ? "Sending..."
                  : isPhoneVerified
                  ? "Verified"
                  : "Get OTP"}
              </button>
            </div>

            {showOTP && !isPhoneVerified && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="flex-1 p-2 border rounded"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isVerifyingOTP || !otp}
                >
                  {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            value={voterForm.name}
            onChange={(e) =>
              setVoterForm({ ...voterForm, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Aadhaar Number"
            className="w-full p-2 border rounded"
            value={voterForm.aadhaarNumber}
            onChange={(e) =>
              setVoterForm({ ...voterForm, aadhaarNumber: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className={`w-full p-2 rounded text-white ${
              isPhoneVerified
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isPhoneVerified}
          >
            Submit Voter Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
