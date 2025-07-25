import { ethers } from "ethers";
import ElectionABI from "../contracts/Election.json";

export const getContract = async () => {
  if (!window.ethereum) throw new Error("No crypto wallet found");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  return new ethers.Contract(contractAddress, ElectionABI.abi, signer);
};
