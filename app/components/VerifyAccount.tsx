'use client';

import React, { useState, useRef, useEffect } from 'react';

const VerifyAccount = ({ onVerify }: { onVerify: () => void }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.every((digit) => digit !== '')) {
      onVerify();
    } else {
      alert('Please enter the complete 6-digit code.');
    }
  };

  return (
   
        <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-sm space-y-6 px-6 sm:px-10 mx-4 sm:mx-auto">
          <div className="mb-6 flex items-center space-x-2">
            <img src="./logo.png" alt="Logo" className="h-8" />
            <h1 className="text-2xl font-semibold">Verify account</h1>
          </div>
          <p className="mb-6 text-gray-600">
            Enter 6-digit code sent to your phone number via WhatsApp
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => { inputsRef.current[index] = el; }}
                  className="w-12 h-14 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-3 rounded-full hover:bg-teal-800 transition-colors"
            >
              Verify OTP
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Resend the code in <strong>30S</strong>
          </p>
        </div>

  );
};

export default VerifyAccount;
