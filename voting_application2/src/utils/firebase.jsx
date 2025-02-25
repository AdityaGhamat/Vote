import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDafuf7IYkepDFhAWC_qB9BN-e8B4CHmow",
  authDomain: "ransomeware-shield.firebaseapp.com",
  projectId: "ransomeware-shield",
  storageBucket: "ransomeware-shield.firebasestorage.app",
  messagingSenderId: "390012643404",
  appId: "1:390012643404:web:5f07aeec86c37bf77eace9",
  measurementId: "G-NW6GWGWMET",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  storage,
  PhoneAuthProvider,
  signInWithCredential,
};
