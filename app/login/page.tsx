'use client';

import React from 'react';
import Login from '../../app/components/Login';
import Footer from '../components/Footer';
import Header from '../components/Header';

const LoginPage = () => {
  const handleGetOtp = () => {
    // Handle OTP request logic here, e.g., navigate to verify account page
  };

  return   ( <div className="min-h-screen bg-white">
      <Header/>
    <Login onGetOtp={handleGetOtp} />
      <Footer />
    </div>)
};

export default LoginPage;
