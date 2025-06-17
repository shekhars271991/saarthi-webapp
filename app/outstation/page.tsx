'use client';

import React from 'react';
import Outstation from '../../app/components/Outstation';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OutstationPage = () => {
 return( <div className="min-h-screen bg-white">
      <Header/>
  <Outstation />
      <Footer/>
    </div>);
};

export default OutstationPage;
