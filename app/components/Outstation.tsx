
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Info, Plane, ArrowLeft } from 'lucide-react';
import { calculateFareOutstation, confirmBooking } from '../services/apiService';

// New fare check API endpoint from Postman collection
import axios from 'axios';
import { toast } from 'react-hot-toast';

const checkFareApi = async (data: any) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/fare/check`, data);
    return response.data;
  } catch (error) {
    toast.error('Failed to check fare');
    throw error;
  }
};

// Declare Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

const Outstation: React.FC = () => {
  const mode = process.env.NEXT_PUBLIC_MODE || 'prod';




  const [bookingStep, setBookingStep] = useState<'form' | 'complete'>('form');
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [locationFrom, setLocationFrom] = useState<string>('');
  const [locationTo, setLocationTo] = useState<string>('');
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [schedule, setSchedule] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(2);
  const [suitcases, setSuitcases] = useState<number>(2);
  const [flightNumber, setFlightNumber] = useState<string>('132');
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [mapSelectionMode, setMapSelectionMode] = useState<'from' | 'to' | null>(null);
  const [fromCoords, setFromCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [toCoords, setToCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [showFromDropdown, setShowFromDropdown] = useState<boolean>(false);
  const [showToDropdown, setShowToDropdown] = useState<boolean>(false);
  const [fromSuggestions, setFromSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [toSuggestions, setToSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [distance, setDistance] = useState<string>('');

  // Carousel state for quotes (used in step 1)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const quotes = [
    "Shoffr has partnered with non-profits to provide up to ₹15,000 per year to drivers for the education of their children.",
    "Our drivers are trained to ensure your safety and comfort during every ride.",
    "Book with us and enjoy a hassle-free airport transfer experience."
  ];

  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const modalMapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window.google === 'undefined') {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;

        script.async = true;
        script.defer = true;
        script.onload = initializeAutocomplete;
        script.onerror = () => console.error('Failed to load Google Maps script');
        document.head.appendChild(script);
      } else {
        initializeAutocomplete();
      }
    };

    loadGoogleMapsScript();
  }, []);

  // Initialize autocomplete with custom dropdown
useEffect(() => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    const pending = localStorage.getItem('pendingOutstation');

    if (user && pending) {
      try {
        const data = JSON.parse(pending);
        // Set state with fallback values
        setTripType(data.tripType || 'oneway');
        setLocationFrom(data.locationFrom || '');
        setLocationTo(data.locationTo || '');
        setSchedule(data.schedule || '');
        setPassengers(data.passengers || 2);
        setSuitcases(data.suitcases || 2);
        setFlightNumber(data.flightNumber || '132');
        setFromCoords(data.fromCoords || null);
        setToCoords(data.toCoords || null);
        setDistance(data.distance || '');

        // Async function to check fare
        (async () => {
          setApiFareLoading(true);
          setApiFareError(null);

          let phoneNumber = '';
          let userId = '';

          // Parse user data
          try {
            const parsedUser = JSON.parse(user);
            userId = parsedUser?._id || '';
            phoneNumber = parsedUser?.phoneNumber || '';
          } catch (error) {
            console.error('Error parsing user data:', error);
          }

          // Prepare payload for API call
          const dataPayload = {
            user_id: userId,
            ride_type: 'outstation',
            hours: 0,
            pickup_location: data.locationFrom || '',
            drop_location: data.locationTo || '', // Fixed: Use data.locationTo instead of undefined locationTo
            pickup_lat: data.fromCoords?.lat || 0,
            pickup_lng: data.fromCoords?.lng || 0,
            drop_lat: data.toCoords?.lat || 0,
            drop_lng: data.toCoords?.lng || 0,
            pickup_datetime: data.schedule || '',
          };

          try {
            // Ensure checkFareApi is defined and properly imported
            const fareData = await checkFareApi(dataPayload); // Fixed: Pass dataPayload to API call
            if (fareData?.fare_details?.fare) {
              setApiFare(fareData.fare_details.fare);
              setRideId(fareData.ride_id || null);
            } else if (typeof fareData?.fare === 'number') {
              setApiFare(fareData.fare);
              setRideId(fareData.ride_id || null);
            } else if (typeof fareData === 'number') {
              setApiFare(fareData);
              setRideId(null);
            } else {
              setApiFareError('Invalid fare data received from server.');
            }
            setBookingStep('complete');
          } catch (error) {
            console.error('Error fetching fare:', error);
            setApiFareError('Could not fetch fare from server.');
          } finally {
            setApiFareLoading(false);
            localStorage.removeItem('pendingOutstation');
          }
        })();
      } catch (error) {
        console.error('Error processing pending outstation data:', error);
        setApiFareError('Failed to process booking data.');
        localStorage.removeItem('pendingOutstation');
      }
    }
  }
}, []);

  const initializeAutocomplete = () => {
    if (!window.google) return;

    autocompleteServiceRef.current = new google.maps.places.AutocompleteService();

    const dummyMap = new google.maps.Map(document.createElement('div'));
    placesServiceRef.current = new google.maps.places.PlacesService(dummyMap);
  };

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Calculate distance when both coordinates are available
  useEffect(() => {
    if (fromCoords && toCoords) {
      const dist = calculateDistance(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng);
      setDistance(dist.toFixed(1));
    }
  }, [fromCoords, toCoords]);

  // Auto-rotate quotes every 5 seconds (for step 1)
  useEffect(() => {
    if (bookingStep === 'form') {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [bookingStep, quotes.length]);

  // Handle input changes and show suggestions
  const handleFromInputChange = (value: string) => {
    setLocationFrom(value);
    if (value.length > 2 && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        { input: value },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setFromSuggestions(predictions);
            setShowFromDropdown(true);
          }
        }
      );
    } else {
      setShowFromDropdown(value.length === 0);
    }
  };

  const handleToInputChange = (value: string) => {
    setLocationTo(value);
    if (value.length > 2 && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        { input: value },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setToSuggestions(predictions);
            setShowToDropdown(true);
          }
        }
      );
    } else {
      setShowToDropdown(value.length === 0);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (prediction: google.maps.places.AutocompletePrediction, type: 'from' | 'to') => {
    if (!placesServiceRef.current) return;

    placesServiceRef.current.getDetails(
      { placeId: prediction.place_id },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
          const coords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          if (type === 'from') {
            setLocationFrom(place.formatted_address || prediction.description);
            setFromCoords(coords);
            setShowFromDropdown(false);
          } else {
            setLocationTo(place.formatted_address || prediction.description);
            setToCoords(coords);
            setShowToDropdown(false);
          }
        }
      }
    );
  };

  // Handle map selection option
  const handleMapSelectionOption = (type: 'from' | 'to') => {
    setMapSelectionMode(type);
    setShowMapModal(true);
    setShowFromDropdown(false);
    setShowToDropdown(false);
  };

  // Initialize modal map
  useEffect(() => {
    if (showMapModal && modalMapRef.current && window.google) {
      const map = new google.maps.Map(modalMapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 }, // Delhi coordinates
        zoom: 10,
        mapTypeControl: false,
        streetViewControl: false,
      });
      googleMapRef.current = map;

      markerRef.current = new google.maps.Marker({
        map: map,
        draggable: true,
      });

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng && markerRef.current) {
          markerRef.current.setPosition(e.latLng);
        }
      });
    }
  }, [showMapModal]);

  const handleMapSelection = () => {
    if (markerRef.current && mapSelectionMode) {
      const position = markerRef.current.getPosition();
      if (position) {
        const coords = {
          lat: position.lat(),
          lng: position.lng(),
        };

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: coords }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const address = results[0].formatted_address;
            if (mapSelectionMode === 'from') {
              setLocationFrom(address);
              setFromCoords(coords);
            } else {
              setLocationTo(address);
              setToCoords(coords);
            }
          }
        });
      }
    }
    setShowMapModal(false);
    setMapSelectionMode(null);
  };

  const incrementPassengers = () => setPassengers((p) => Math.min(p + 1, 10));
  const decrementPassengers = () => setPassengers((p) => Math.max(p - 1, 1));
  const incrementSuitcases = () => setSuitcases((s) => Math.min(s + 1, 10));
  const decrementSuitcases = () => setSuitcases((s) => Math.max(s - 1, 0));

  const [coupon, setCoupon] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);

  const handleApplyCoupon = () => {
    if (coupon.toLowerCase() === 'save200') {
      setDiscount(200);
    } else {
      alert('Invalid coupon code');
    }
  };

  const [apiFare, setApiFare] = useState<number | null>(null);
  const [apiFareLoading, setApiFareLoading] = useState(false);
  const [apiFareError, setApiFareError] = useState<string | null>(null);
  const [rideId, setRideId] = useState<string | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const handleCheckFare = async () => {
    if (!locationFrom || !locationTo || !schedule) {
      alert('Please fill in all required fields.');
      return;
    }
    let user = null;
    if (typeof window !== 'undefined') {
      user = localStorage.getItem('user');
    }
    if (!user) {
      // Store form data in localStorage and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'pendingOutstation',
          JSON.stringify({
            tripType,
            locationFrom,
            locationTo,
            schedule,
            passengers,
            suitcases,
            flightNumber,
            fromCoords,
            toCoords,
          })
        );
        window.location.href = '/login?redirect=outstation';
      }
      return;
    }
    setApiFareLoading(true);
    setApiFareError(null);
    try {
      let phoneNumber = '';
      let userId = '';
      if (user) {
        const parsed = JSON.parse(user);
        phoneNumber = parsed.phoneNumber || '';
        userId = parsed._id || '';
      }
      // Prepare data for new fare check API
      const data = {
        user_id: userId,
        ride_type: 'outstation',
        hours: 0,
        pickup_location: locationFrom,
        drop_location: locationTo,
        pickup_lat: fromCoords?.lat || 0,
        pickup_lng: fromCoords?.lng || 0,
        drop_lat: toCoords?.lat || 0,
        drop_lng: toCoords?.lng || 0,
        pickup_datetime: schedule,
      };
      const fareData = await checkFareApi(data);
      if (fareData && fareData.fare_details) {
        setApiFare(fareData.fare_details.fare);
        setRideId(fareData?.ride_id);
      } else if (fareData && typeof fareData.fare === 'number') {
        setApiFare(fareData.fare);
        setRideId(fareData.ride_id || null);
      } else if (typeof fareData === 'number') {
        setApiFare(fareData);
      } else {
        setApiFareError('Could not fetch fare from server.');
      }
      setBookingStep('complete');
    } catch (err) {
      setApiFareError('Could not fetch fare from server.');
    } finally {
      setApiFareLoading(false);
    }
  };

 const handleBookingConfirmed = async () => {
     if (!rideId) {
       alert('No ride to confirm.');
       return;
     }
     try {
       await confirmBooking(rideId);
       setShowBookingDialog(true);
     } catch {
       alert('Failed to confirm booking.');
     }
   };

  const handleCloseDialog = () => {
    setShowBookingDialog(false);
  };

  const handleCopyRideId = () => {
    if (rideId) {
      navigator.clipboard.writeText(rideId);
    }
  };

 const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return `${time} - ${formattedDate}`;
  };

  const distanceInKm = parseFloat(distance);
  const baseFare = apiFare !== null ? apiFare : distanceInKm * 20; // Prefer API fare
  const totalAmount = baseFare - discount;



  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Section - Only shown in Step 1 */}
      {bookingStep === 'form' && (
        <div className="md:w-1/2 bg-[#1A1C21] text-white flex flex-col justify-center items-center p-6 md:p-12">
          <div className="max-w-md text-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Did you know</h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed min-h-[100px] transition-opacity duration-500">
              {quotes[currentQuoteIndex]}
            </p>
            <div className="mt-6 md:mt-8 flex justify-center space-x-2">
              {quotes.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                    index === currentQuoteIndex ? 'bg-teal-500' : 'bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className={`${bookingStep === 'form' ? 'flex-1 md:w-1/2 p-6 md:p-12' : 'w-full  p-4 md:p-12 flex flex-col'}`}>
        {bookingStep === 'form' ? (
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Outstation</h2>
<div className="flex mb-4 md:mb-6">
          <button
            className={`px-4 py-2 rounded-l-full border border-gray-300 ${tripType === 'oneway' ? 'bg-orange-200' : 'bg-white'}`}
            onClick={() => setTripType('oneway')}
          >
            One way
          </button>
          <button
            className={`px-4 py-2 rounded-r-full border border-gray-300 ${tripType === 'roundtrip' ? 'bg-orange-200' : 'bg-white'}`}
            onClick={() => setTripType('roundtrip')}
          >
            Round trip
          </button>
        </div>
           

            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
            <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                {mode === 'test' ? (
                  <input
                    type="text"
                    placeholder="Location"
                    value={locationFrom}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationFrom(e.target.value)}
                    className="w-full border border-gray-300 rounded-md pl-10 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                ) : (
                  <>
                    <input
                      ref={fromInputRef}
                      type="text"
                      placeholder="Location"
                      value={locationFrom}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFromInputChange(e.target.value)}
                      onFocus={() => setShowFromDropdown(true)}
                      onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                      className="w-full border border-gray-300 rounded-md pl-10 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    {showFromDropdown && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                        <div
                          onClick={() => handleMapSelectionOption('from')}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                          Select location on map
                        </div>
                        {fromSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => handleSuggestionSelect(suggestion, 'from')}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                          >
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              <div>
                                <div className="font-medium text-sm md:text-base">{suggestion.structured_formatting?.main_text}</div>
                                <div className="text-xs md:text-sm text-gray-500">{suggestion.structured_formatting?.secondary_text}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  ref={toInputRef}
                  type="text"
                  placeholder="Location"
                  value={locationTo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleToInputChange(e.target.value)}
                  onFocus={() => setShowToDropdown(true)}
                  onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                  className="w-full border border-gray-300 rounded-md pl-10 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                {showToDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    <div
                      onClick={() => handleMapSelectionOption('to')}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Select location on map
                    </div>
                    {toSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionSelect(suggestion, 'to')}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <div>
                            <div className="font-medium text-sm md:text-base">{suggestion.structured_formatting?.main_text}</div>
                            <div className="text-xs md:text-sm text-gray-500">{suggestion.structured_formatting?.secondary_text}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Schedule</label>
              <div className="relative">
<input
  type="datetime-local"
  value={schedule}
  min={new Date().toISOString().slice(0, 16)}
  max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
  step="300"
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchedule(e.target.value)}
  className="w-full border border-gray-300 rounded-md py-2 md:py-3 px-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-600 appearance-none"
/>
              </div>
            </div>

            {distance && (
              <div className="mb-4 md:mb-6 p-3 bg-blue-50 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 font-medium text-sm md:text-base">Distance:</span>
                  <span className="text-blue-900 font-semibold text-sm md:text-base">{distance} km</span>
                </div>
              </div>
            )}

            <div className="bg-[#E7F5F3] p-4 rounded-md mb-4 md:mb-6">
            <div className="flex items-center mb-3 relative">
      <span className="text-gray-700 font-medium text-sm md:text-base">Guest Info</span>
      <div
        className="relative ml-2"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
        {isTooltipVisible && (
          <div className="absolute left-6 top-0 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
            We need this information to allocate the right car
          </div>
        )}
      </div>
    </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 text-sm md:text-base">Passengers</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={decrementPassengers}
                    className="border border-gray-300 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-700 bg-white hover:bg-gray-50 text-sm md:text-base"
                  >
                    −
                  </button>
                  <span className="text-gray-700 font-medium w-6 md:w-8 text-center text-sm md:text-base">{passengers}</span>
                  <button
                    onClick={incrementPassengers}
                    className="border border-gray-300 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-700 bg-white hover:bg-gray-50 text-sm md:text-base"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 text-sm md:text-base">Suitcase</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={decrementSuitcases}
                    className="border border-gray-300 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-700 bg-white hover:bg-gray-50 text-sm md:text-base"
                  >
                    −
                  </button>
                  <span className="text-gray-700 font-medium w-6 md:w-8 text-center text-sm md:text-base">{suitcases}</span>
                  <button
                    onClick={incrementSuitcases}
                    className="border border-gray-300 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-700 bg-white hover:bg-gray-50 text-sm md:text-base"
                  >
                    +
                  </button>
                </div>
              </div>
             
            </div>

            <button
              onClick={handleCheckFare}
              className={`w-full bg-[#016B5D] text-white py-3 rounded-full hover:bg-[#014D40] transition-colors font-medium text-sm md:text-base flex items-center justify-center ${apiFareLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={apiFareLoading}
            >
              {apiFareLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Check Fare'
              )}
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
     <button
              style={{width:"fit-content",alignItems:"center",display:"flex"}}
                    onClick={()=>setBookingStep("form")}
                    className=" px-6 py-2 rounded-full   font-medium mb-2"
                  >
                   <ArrowLeft  className='mr-1 '/> {"    "} Back
                  </button>
            <h2 className=" text-2xl font-semibold mb-6">Complete Booking</h2>
            <div className="flex flex-col md:flex-row justify-between flex-1 gap-6">
              {/* Trip Summary and Booking Policy */}
              <div className="flex-1">
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Trip Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center bg-[#F5F5F5] p-4 rounded-lg">
                      <MapPin className="w-6 h-6 text-gray-500 mr-4 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Pickup</p>
                        <p className="text-base font-medium text-gray-800">{tripType === 'oneway' ? locationFrom || 'Janakpuri' : locationTo}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-[#F5F5F5] p-4 rounded-lg">
                      <MapPin className="w-6 h-6 text-gray-500 mr-4 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Drop</p>
                        <p className="text-base font-medium text-gray-800">{tripType === 'roundtrip' ? locationTo || 'Airport' : locationFrom}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-[#F5F5F5] p-4 rounded-lg">
                      <Calendar className="w-6 h-6 text-gray-500 mr-4 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Pickup time</p>
                        <p className="text-base font-medium text-gray-800">{schedule ? formatDateTime(schedule) : '11:40 pm - 13th May'}</p>
                      </div>
                    </div>
                   
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Booking policy</h3>
                  <ul className="list-disc pl-5 space-y-3 text-gray-600 text-sm">
                    <li>We do not charge any cancellation fee at the moment.</li>
                    <li>You can cancel your trip anytime, though we would appreciate you giving 2 hours prior notice.</li>
                    <li>Reach out at +91-7204323223 for any help.</li>
                    <li>Rentals are available within city limits.</li>
                  </ul>
                </div>
              </div>

              {/* Fare Summary */}
              <div className="md:w-[380px] h-[fit-content] bg-[#E7F5F3] p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Fare Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base fare</span>
                    <span className="font-medium text-gray-800">
                      {apiFareLoading
                        ? 'Loading...'
                        : apiFare !== null
                        ? Math.round(apiFare)
                        : Math.round(baseFare)}
                        {
                          " "
                        }
                        {"INR"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Distance ({distance} km)</span>
                    <span className="font-medium text-gray-800">{distance} km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-{discount}</span>
                  </div>
                  <div className="flex items-center mt-4">
                    <input
                      type="text"
                      placeholder="Apply coupon"
                      value={coupon}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCoupon(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="ml-2 bg-[#016B5D] text-white px-4 py-2 rounded-lg hover:bg-[#014D40] text-sm"
                    >
                      Apply
                    </button>
                  </div>
                  {apiFareError && (
                    <div className="text-red-600 text-xs">{apiFareError}</div>
                  )}
                  <div className="flex justify-between pt-4 border-t border-gray-300 mt-4 text-base font-medium">
                    <span>Total Amount</span>
                    <span>
                      {apiFareLoading
                        ? 'Loading...'
                        : apiFare !== null
                        ? Math.round(totalAmount)
                        : Math.round(totalAmount)}
                        {
                          " "
                        }
                        {"INR"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 gap-3">
                
                <button
                    onClick={handleBookingConfirmed}
                    className="bg-[#016B5D] text-white px-6 py-2 rounded-full hover:bg-[#014D40] text-sm font-medium flex-1"
                  >
                    Confirm Booking
                  </button>

                  
                </div>
                <br/>
                <h6 className='text-xs'>You can make the payment directly to the driver via UPI after completion of the trip</h6>
              </div>
            </div>
          </div>
        )}
      </div>

      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-semibold">
                Select {mapSelectionMode === 'from' ? 'pickup' : 'destination'} location
              </h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div ref={modalMapRef} className="w-full h-80 md:h-96 rounded-md bg-gray-200 mb-4"></div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowMapModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleMapSelection}
                className="px-4 py-2 bg-[#016B5D] text-white rounded-md hover:bg-[#014D40] text-sm md:text-base"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    {/* Booking Confirmation Dialog */}
    {showBookingDialog && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
            onClick={handleCloseDialog}
          >
            ×
          </button>
          <div className="flex flex-col items-center">
            {/* Green tick or driver icon */}
            <div className="mb-4">
              <svg
                className="mx-auto"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="32" fill="#10B981" />
                <path
                  d="M20 34L29 43L44 28"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2 text-center">Booking Confirmed!</h2>
            <p className="text-gray-700 mb-4 text-center">Your ride has been booked successfully.</p>
            {rideId && (
              <div className="flex flex-col items-center mb-2 w-full">
                <span className="text-gray-600 text-sm mb-1">Ride ID:</span>
                <div className="flex items-center justify-center w-full">
                  <span className="font-mono text-base bg-gray-100 px-2 py-1 rounded select-all break-all">{rideId}</span>
                  <button
                    onClick={handleCopyRideId}
                    className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
            <a
             href="/my-trips"
              className="mt-6 bg-[#016B5D] text-white px-6 py-2 rounded-full hover:bg-[#014D40] text-sm font-medium"
            >
              Your Profile
            </a>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default Outstation;
