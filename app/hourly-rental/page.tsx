'use client';

import React from 'react';
import HourlyRental from '../../app/components/HourlyRental';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HourlyRentalPage = () => {
return( <div className="min-h-screen bg-white">
      <Header/>
  <HourlyRental />
      <Footer/>
    </div>);
};

export default HourlyRentalPage;
