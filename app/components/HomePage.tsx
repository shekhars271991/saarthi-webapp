"use client";

import { useState } from 'react';
import { Sparkles, MapPin, Clock, Car, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Dagem Tadesse",
    handle: "@dagemTadesse",
    avatar: "/user-placeholder.jpg",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "/testimonial-placeholder.jpg"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    handle: "@sarahj",
      avatar: "/user-placeholder.jpg",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "/testimonial-placeholder.jpg"
  },
  {
    id: 3,
    name: "Michael Chen",
    handle: "@mchen",
     avatar: "/user-placeholder.jpg",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "/testimonial-placeholder.jpg"},
  {
    id: 4,
    name: "Emma Wilson",
    handle: "@emmaw",
     avatar: "/user-placeholder.jpg",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "/testimonial-placeholder.jpg"
  }
];

export default function Homepage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-[#EFF5F2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Promotional Banner */}
              <div className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                50% off on 1st booking - Use coupon code FIRSTRIDE -
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-2xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Professional Chauffeurs,{' '}
                  <span className="text-[#016B5D]">Dependable Service.</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-lg">
                  Safe, timely, and exceptional chauffeur service.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4  text-center lg:text-left">
                <div className="text-black  py-3 rounded-full text-[22px] font-medium inline-flex items-center space-x-2 transition-colors">
                  <span>Book Now</span>
                  <Sparkles className="w-5 h-5" />
                </div>

                {/* Service Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 justify-center lg:justify-start">
                  <a href="/airport-transfer" className="bg-[#016B5D] hover:bg-teal-700 text-white px-8 py-3 rounded-full text-[16px] sm:text-[16px] lg:text-[22px] font-medium inline-flex items-center space-x-2 transition-colors">
                    <MapPin className="w-6 h-6" />
                    <span>Airport transfer</span>
                  </a>
                  <a href="/hourly-rental" className="bg-[#016B5D] hover:bg-teal-700 text-white px-8 py-3 rounded-full text-[16px] sm:text-[16px] lg:text-[22px]  font-medium inline-flex items-center space-x-2 transition-colors">
                    <Clock className="w-6 h-6" />
                    <span>Hourly Rental</span>
                  </a>
                                  </div>
                  <a href="/outstation" className="bg-[#016B5D] hover:bg-teal-700 text-white px-8 py-3 rounded-full text-[16px] sm:text-[16px] lg:text-[22px]  font-medium inline-flex items-center space-x-2 transition-colors">
                    <Car className="w-6 h-6" />
                    <span>Outstation trip</span>
                  </a>

              </div>
            </div>

            {/* Right Content - Car Image */}
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/hro.png"
                  alt="Professional chauffeur car"
                  width={800}
                  height={600}
                  className="rounded-2xl "
                />
              </div>
              {/* Background decoration */}
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-teal-100 rounded-full opacity-20 -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-orange-100 rounded-full opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Hear From Our Customers
          </h2>

          {/* Desktop Testimonials - Horizontal Scroll without scrollbar */}
          <div className="hidden md:block">
            <div className="flex space-x-6 py-4 overflow-x-auto scrollbar-hide">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="p-6">
                    {/* User Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">{testimonial.handle}</p>
                        </div>
                      </div>
                      <X className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {testimonial.content}
                    </p>

                    {/* Image */}
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt="Customer experience"
                        width={400}
                        height={200}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Testimonials - Single Card with Navigation */}
          <div className="md:hidden">
            <div className="relative">
              <div className="bg-white rounded-lg shadow-lg border border-gray-100">
                <div className="p-6">
                  {/* User Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={testimonials[currentTestimonial].avatar}
                        alt={testimonials[currentTestimonial].name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</p>
                        <p className="text-sm text-gray-500">{testimonials[currentTestimonial].handle}</p>
                      </div>
                    </div>
                    <X className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {testimonials[currentTestimonial].content}
                  </p>

                  {/* Image */}
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src={testimonials[currentTestimonial].image}
                      alt="Customer experience"
                      width={400}
                      height={200}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center space-x-2 mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-[#016B5D]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}