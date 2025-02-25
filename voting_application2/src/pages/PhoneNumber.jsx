import React, { useState } from "react";
import { Phone, ArrowRight } from "lucide-react";
import { useFirebase } from "../context/FirebaseContext";

const PhoneNumberEntry = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const { requestOTP } = useFirebase();

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const number = value.replace(/[^\d]/g, "");
    // Format number as (XXX) XXX-XXXX
    if (number.length <= 3) return number;
    if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(
      6,
      10
    )}`;
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setPhoneNumber(formatted);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const digits = phoneNumber.replace(/[^\d]/g, "");

    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    console.log(phoneNumber);
    try {
      const response = await requestOTP(`+91${digits}`);
      console.log("OTP sent successfully:", response);
    } catch (error) {
      setError(error.message);
    }
    // Here you would typically make an API call to send OTP
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Phone className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Enter Phone Number
          </h1>
          <p className="text-gray-600 mt-2">
            We'll send you a verification code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={handleChange}
              placeholder="(123) 456-7890"
              className={`w-full px-4 py-3 border-2 rounded-lg text-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-200
                       transition-colors duration-200
                       ${
                         error
                           ? "border-red-500"
                           : "border-gray-300 focus:border-blue-500"
                       }`}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg
                     hover:bg-blue-700 transition-colors duration-200
                     flex items-center justify-center space-x-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!phoneNumber}
          >
            <span>Send Code</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          By continuing, you agree to receive SMS messages for verification
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberEntry;
