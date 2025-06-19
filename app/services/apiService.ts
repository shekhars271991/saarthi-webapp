import axios from 'axios';
import { toast } from 'react-hot-toast';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error: any) => {
  if (error.response && error.response.data && error.response.data.message) {
    toast.error(error.response.data.message);
  } else {
    toast.error('An unexpected error occurred');
  }
  throw error;
};

export const signup = async (name: string, email: string, phone_number: string) => {
  try {
    const response = await api.post('/signup', { name, email, phone_number });
    // toast.success('Signup successful');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifyOtp = async (phone_number: string, otp: string) => {
  try {
    const response = await api.post('/verify', { phone_number, otp });
    // toast.success('OTP verified, account activated');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};


export const generateOTP = async (phone_number: string) => {
  try {
    const response = await api.post('/generate-otp', { phone_number });
    // toast.success('OTP sent to your mobile phone');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const loginOtp = async (phone_number: string, otp: string) => {
  try {
    const response = await api.post('/login', { phone_number, otp });
    // toast.success('Login successful');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const calculateFareHourly = async (phone_number: string, hours: number, pickup_location: string, drop_location: string) => {
  try {
    const response = await api.post('/fare/hourly', { phone_number, hours, pickup_location, drop_location });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const calculateFareOutstation = async (phone_number: string, pickup_location: string, drop_location: string) => {
  try {
    const response = await api.post('/fare/outstation', { phone_number, pickup_location, drop_location });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const calculateFareAirTransfer = async (phone_number: string, pickup_location: string, drop_location: string) => {
  try {
    const response = await api.post('/fare/air-transfer', { phone_number, pickup_location, drop_location });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const listRides = async (phone_number: string) => {
  try {
    const response = await api.get('/rides', { params: { phone_number } });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const generateInvoice = async (ride_id: string) => {
  try {
    const response = await api.post('/invoice', { ride_id });
    toast.success('Invoice generated');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getTestimonials = async () => {
  try {
    const response = await api.get('/testimonials');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
