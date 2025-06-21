'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Menu, X, User, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    }
  }, []);

  // Remove the useEffect for outside click handling
  // No need to add event listeners for closing dropdown on outside clicks

  const handleLogout = () => {
    console.log('Logout function called'); // Debug log
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    router.replace('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="mx-auto lg:mx-[0] px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <img src="./header-logo.png" alt="Saartheiv Logo" className="h-36 lg:h-48 w-36 lg:w-48" />
          </a>

          {/* Right Side: Book a Ride and Hamburger Menu for Mobile */}
          <div className="flex items-center space-x-3 md:space-x-8">
            {/* Book a Ride Button (Visible on Mobile) */}
            <div
              className="bg-[#016B5D] text-white px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors font-medium text-sm md:hidden"
            >
              Bangalore
            </div>

            

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
                  <a
                    href="/our-services"
                    className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 transition-colors font-medium"
                  >
                    <span>Services</span>
                  </a>
                </div>
                <a href="/faq" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
                  FAQ
                </a>

                {user && <a href="/my-trips" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
                  My Trips
                </a>}
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <div
                  className="bg-[#016B5D] text-white px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors font-medium text-sm"
                >
                  Bangalore
                </div>
                   <a
                   href="/"
                  className="bg-[#016B5D] text-white px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors font-medium text-sm"
                >
                 <Home/>
                </a>
                {!user ? (
                  <a
                    href="/login"
                    className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    Login
                  </a>
                ) : (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="flex items-center space-x-2 border border-gray-300 px-4 py-2.5 rounded-full hover:border-gray-400 transition-colors font-medium text-sm focus:outline-none"
                      onClick={() => setDropdownOpen((open) => !open)}
                    >
                      <User className="w-5 h-5" />
                    <span>{user.name || ""}</span>
                    {dropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="px-4 py-3 text-gray-700 font-medium border-b">{user.name || ""}</div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
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
              {!user ? (
                <a
                  href="/login"
                  className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 transition-colors font-medium mb-4"
                >
                  Login
                </a>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 transition-colors font-medium mb-4"
                    onClick={() => setDropdownOpen((open) => !open)}
                  >
                    <User className="w-5 h-5" />
                    <span>{user.name}</span>
                    {dropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="px-4 py-3 text-gray-700 font-medium border-b">{user.name}</div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
              <a
                href="/our-services"
                className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 transition-colors font-medium"
              >
                <span>Services</span>
              </a>
            </div>
            <a href="#" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
              FAQ
            </a>
           {user && <a href="/my-trips" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
              My Trips
            </a>}
          </nav>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col space-y-3">
            <a
              href="/"
              className="bg-[#016B5D] text-white px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors font-medium text-sm"
            >
              Book a Ride
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
