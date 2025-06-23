import React from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Logo */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center justify-center md:justify-start space-x-2 ">
              <img src="./footer-logo.png" alt="Footer Logo" />
            </Link>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/airport-transfer" className="text-gray-300 hover:text-white transition-colors">
                  Airport transfers
                </Link>
              </li>
              <li>
                <Link href="/hourly-rental" className="text-gray-300 hover:text-white transition-colors">
                  City rentals
                </Link>
              </li>
              <li>
                <Link href="/outstation" className="text-gray-300 hover:text-white transition-colors">
                  Outstation trips
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about-us" className="text-gray-300 hover:text-white transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/privacy-and-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy and policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-refund" className="text-gray-300 hover:text-white transition-colors">
                  Cancellation & refund
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-gray-300 hover:text-white transition-colors">
                  Terms and conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <h3 className="text-gray-300 hover:text-white transition-colors">
              Support and Queries <br />
              ( +91 766156671X)
            </h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10  rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">Copyright 2024 All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
