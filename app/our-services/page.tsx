'use client';

import React from 'react';
import OurServices from '../../app/components/OurServices';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OurServicesPage = () => {
    return (
    <div className="min-h-screen bg-white">
      <Header />
      <OurServices/>
      <Footer />
    </div>
  );
};

export default OurServicesPage;
