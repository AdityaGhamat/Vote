import { createContext, useContext, useState } from "react";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithCredential,
  PhoneAuthProvider,
  storage,
} from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useWeb3 } from "./Web3Context";
import axios from "axios";
const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [verificationId, setVerificationId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const uploadImage = async (file, folder) => {
    if (!file) return null;
    const fileRef = ref(storage, `${folder}/${uuidv4()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const requestOTP = async (phoneNumber, walletAddress) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/otp/send-otp`,
        { phoneNumber, walletAddress }
      );
      const { data } = response;
      setOtpSent(true);
      return data;
    } catch (error) {
      console.error("Otp Sending Failed:", error);
      return false;
    }
  };

  const verifyOTP = async (phoneNumber, walletAddress, otp) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/otp/verify-otp`,
        { phoneNumber, walletAddress, otp }
      );
      const { data } = response;
      return data;
    } catch (error) {
      console.error("Otp verification has been failed:", error);
      return false;
    }
  };

  const endElections = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/contestant`
      );
    } catch (error) {}
  };

  return (
    <FirebaseContext.Provider
      value={{ uploadImage, requestOTP, verifyOTP, otpSent, isVerified }}
    >
      {children}
      {/* Ensure recaptcha container is in the DOM */}
      <div id="recaptcha-container"></div>
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
