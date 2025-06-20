'use client';

import React from 'react';
import Outstation from '../../app/components/Outstation';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OutstationPage = () => {
  const router = useRouter();

  useEffect(() => {
    
  }, [router]);

  return( <div className="min-h-screen bg-white">
      <Header/>
      <Outstation />
      <Footer/>
    </div>);
};

export default OutstationPage;
