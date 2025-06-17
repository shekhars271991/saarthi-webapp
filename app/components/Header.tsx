'use client';

import React, { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
     <header className="bg-white shadow-sm border-b border-gray-100">
      <div className=" mx-auto lg:mx-[0] px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <img src="./header-logo.png" alt="Saartheiv Logo" className="h-36 lg:h-48  w-36 lg:w-48" />
         
          </a>

          {/* Right Side: Book a Ride and Hamburger Menu for Mobile */}
          <div className="flex items-center space-x-3 md:space-x-8">
            {/* Book a Ride Button (Visible on Mobile) */}
            <a href="/" className="bg-[#016B5D] text-white px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors font-medium text-sm md:hidden">
              Book a Ride
            </a>

            {/* Hamburger Menu for Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Right side - Navigation and Buttons (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Navigation */}
              <nav className="flex items-center space-x-8">
                <div className="relative group">
                  <a href="/our-services" className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 transition-colors font-medium">
                    <span>Services</span>
                    {/* <ChevronDown className="w-4 h-4" /> */}
                  </a>
                  {/* <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <a href="/outstation" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Book Outstation</a>
                    <a href="/airport-transfer" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Airport Transfers</a>
                    <a href="/hourly-rental" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Hourly Rental</a>
                  </div> */}
                </div>
                <a href="/faq" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
                  FAQ
                </a>
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <a href="/" className="bg-[#016B5D] text-white px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors font-medium text-sm">
                  Book a Ride
                </a>
                <a href="/login" className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium text-sm">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sliding Overlay Menu for Mobile */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-16 px-4">
          {/* Navigation Links */}
          <nav className="flex flex-col space-y-4">
            <div className="relative group">
              <a href="/our-services" className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 transition-colors font-medium">
                <span>Services</span>
                {/* <ChevronDown className="w-4 h-4" /> */}
              </a>
            </div>
            <a href="#" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col space-y-3">
            <a href="/" className="bg-[#016B5D] text-white px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors font-medium text-sm">
              Book a Ride
            </a>
            <a href="/login" className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium text-sm">
              Login
            </a>
          </div>
        </div>
      </div>

      {/* Overlay Background */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
