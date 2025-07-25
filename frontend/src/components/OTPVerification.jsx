import React, { useState, useEffect } from "react";
import { Shield, ArrowRight, RefreshCw } from "lucide-react";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (element.value && index < 5) {
      const nextInput =
        element.parentElement.nextElementSibling?.querySelector("input");
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput =
        e.target.parentElement.previousElementSibling?.querySelector("input");
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Verifying OTP:", otp.join(""));
  };

  const handleResendOTP = () => {
    // Reset OTP fields
    setOtp(["", "", "", "", "", ""]);
    // Reset timer
    setTimeLeft(30);
    setCanResend(false);
    // Here you would typically make an API call to resend OTP
    console.log("Resending OTP");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Enter Verification Code
          </h1>
          <p className="text-gray-600 mt-2">
            We've sent a verification code to your phone
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between space-x-2">
            {otp.map((digit, index) => (
              <div key={index} className="w-12">
                <input
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full h-12 text-center border-2 border-gray-300 rounded-lg 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           outline-none transition-colors text-xl font-semibold"
                  required
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={otp.some((digit) => !digit)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg
                     hover:bg-blue-700 transition-colors duration-200
                     flex items-center justify-center space-x-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Verify Code</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={handleResendOTP}
            disabled={!canResend}
            className="flex items-center space-x-2 text-blue-600 
                     hover:text-blue-700 disabled:text-gray-400 
                     disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Resend Code</span>
          </button>
          {!canResend && <span className="text-gray-500">({timeLeft}s)</span>}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
