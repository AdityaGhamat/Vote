import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Voting from "./pages/Voting";
import Results from "./pages/Results";
import AdminPanel from "./pages/AdminPanel";
import { Web3Provider } from "./context/Web3Context";
import { FirebaseProvider } from "./context/FirebaseContext";
import PhoneNumberEntry from "./pages/PhoneNumber";
import OTPVerification from "./components/OtpVerification";
const App = () => {
  return (
    <Web3Provider>
      <FirebaseProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/voting" element={<Voting />} />
                <Route path="/results" element={<Results />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/phone" element={<PhoneNumberEntry />} />
                <Route path="/otp" element={<OTPVerification />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </FirebaseProvider>
    </Web3Provider>
  );
};

export default App;
