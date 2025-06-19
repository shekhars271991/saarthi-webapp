'use client';

import React from 'react';
import CreateAccountPage from '../../app/components/CreateAccountPage';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CreateAccount = () => {
  const handleRegister = () => {
    // Handle post-registration logic here, e.g., navigate to verify account page
  };
return (
    <div className="min-h-screen bg-white">
      <Header/>
      <CreateAccountPage onRegister={handleRegister} />
      <Footer />
    </div>
  );

};

export default CreateAccount;
