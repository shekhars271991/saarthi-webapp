'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import { listRides, generateInvoice } from '../services/apiService';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MyTripsPage = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [userPhone, setUserPhone] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (!user) {
        router.replace('/login');
        return;
      }
      const parsed = JSON.parse(user);
      setUserPhone(parsed.phoneNumber || '');
    }
  }, [router]);

  useEffect(() => {
    if (!userPhone) return;
    setLoading(true);
    listRides(userPhone)
      .then((data) => {
        if (Array.isArray(data)) setTrips(data);
      })
      .catch((error) => {
        console.error('Error fetching trips:', error);
        alert('Failed to load trips. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [userPhone]);

  const handleInvoice = async (rideId: string) => {
    setInvoiceLoading(rideId);
    try {
      const invoicedetail = await generateInvoice(rideId);
      const invoice = invoicedetail?.invoice_details
      // Debug: Log the API response

      if (invoice && invoice.ride && invoice.amount) {
        // Generate a simple text invoice
        const content = `INVOICE

Ride ID: ${invoice.ride}
Amount: ₹${invoice.amount}
Invoice ID: ${invoice._id}
Created At: ${new Date(invoice.createdAt).toLocaleString()}

Thank you for riding with us!
`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${invoice.ride}.txt`;
        document.body.appendChild(a);
        a.click();

        // Increased timeout for reliable download
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 2000); // 2 seconds for better compatibility

      } else if (invoice && invoice.url) {
        window.open(invoice.url, '_blank');
      } else {
        console.error('Invalid invoice data:', invoice);
        alert('Failed to generate invoice: Invalid response from server.');
      }
    } catch (error: any) {
      console.error('Error generating invoice:', error.message || error);
      alert(`Failed to generate invoice: ${error.message || 'Unknown error'}`);
    } finally {
      setInvoiceLoading(null);
    }
  };

  // Pagination (simple, 4 per page)
  const tripsPerPage = 4;
  const pagedTrips = trips.slice((page - 1) * tripsPerPage, page * tripsPerPage);
  const totalPages = Math.ceil(trips.length / tripsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">My trips</h1>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : pagedTrips.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No trips found.</div>
        ) : (
          <div className="space-y-4">
            {pagedTrips.map((trip) => (
              <div
                key={trip.ride_id || trip._id}
                className="bg-[#F2F7F5] rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Trip ID: {trip.ride_id || trip._id}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    {trip.schedule
                      ? new Date(trip.schedule).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                        ' — ' +
                        new Date(trip.schedule).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                      : ''}
                  </div>
                  <div className="font-medium text-lg mb-1">
                    {trip.type === 'hourly'
                      ? `City Rental for ${trip.hours || 1} hour${trip.hours > 1 ? 's' : ''}`
                      : trip.type === 'outstation'
                      ? 'Outstation Trip'
                      : trip.type === 'airport'
                      ? 'Airport Transfer'
                      : 'Trip'}
                  </div>
                  <div className="text-base text-gray-700">
                    Total Fare: ₹{trip.fare || trip.totalFare || trip.price || 0}
                  </div>
                </div>
                <button
                  onClick={() => handleInvoice(trip.ride_id || trip._id)}
                  className="mt-4 md:mt-0 md:ml-6 flex items-center bg-[#016B5D] text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-colors font-medium text-sm"
                  disabled={invoiceLoading === (trip.ride_id || trip._id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {invoiceLoading === (trip.ride_id || trip._id) ? 'Loading...' : 'Invoice'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
              disabled={page === 1}
            >
              ←
            </button>
            <span className="px-4 py-2 border rounded">{page}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
              disabled={page === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyTripsPage;