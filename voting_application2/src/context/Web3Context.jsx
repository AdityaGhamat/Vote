import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import ElectionABI from "../contracts/Election.json";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    initializeWeb3();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
    }

    return () => {
      // Cleanup the listener when the component unmounts
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      }
    };
  }, []);

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        // Replace with your deployed contract address
        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
        const electionContract = new ethers.Contract(
          contractAddress,
          ElectionABI.abi,
          signer
        );

        setAccount(accounts[0]);
        setContract(electionContract);

        const admin = await electionContract.admin();
        setIsAdmin(accounts[0].toLowerCase() === admin.toLowerCase());

        const currentPhase = await electionContract.state();
        setPhase(currentPhase);

        // Listen for phase changes
        electionContract.on("PhaseChanged", (newPhase) => {
          setPhase(newPhase);
        });
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    }
  };

  const handleAccountChange = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);

      if (contract) {
        const admin = await contract.admin();
        setIsAdmin(accounts[0].toLowerCase() === admin.toLowerCase());
      }
    } else {
      // If no accounts are found, reset state
      setAccount(null);
      setIsAdmin(false);
    }
  };

  return (
    <Web3Context.Provider value={{ account, contract, isAdmin, phase }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
