'use client';

import React, { useState } from 'react';

const CreateAccountPage = ({ onRegister }: { onRegister: () => void }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('+251');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally handle form validation and submission
    onRegister();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 flex flex-col justify-center">
      <main className="flex-grow flex items-center justify-center p-2">
        <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md space-y-6 px-6 sm:px-10 mx-4 sm:mx-auto">
          <div className="mb-6 flex items-center space-x-2">
            <img src="./logo.png" alt="Logo" className="h-8" />
            <h1 className="text-2xl font-semibold">Create Account</h1>
          </div>
          <p className="mb-6 text-gray-600">Fill the information below to get started</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <div className="flex space-x-3">
              <select
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="+251">+251</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                {/* Add more country codes as needed */}
              </select>
              <input
                type="tel"
                style={{width:"80%"}}
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="flex-grow border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-3 rounded-full hover:bg-teal-800 transition-colors"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Already have an account? <a href="/login" className="font-semibold underline">Log In</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default CreateAccountPage;
