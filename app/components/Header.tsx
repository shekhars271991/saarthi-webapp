'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
       
              <img src ="./logo.png"/>
            
            <span className="text-xl font-semibold text-gray-900">Saartheiv</span>
          </div>

          {/* Right side - Navigation and Buttons */}
          <div className="flex items-center space-x-8">
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 transition-colors font-medium">
                  <span>Services</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <a href="#" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
                FAQ
              </a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="bg-[#016B5D] text-white px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors font-medium text-sm">
                Book a Ride
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium text-sm">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;