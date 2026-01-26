import axios from 'axios';
import type { TripData } from './types';

const API = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Dodaj token automatski na svaki request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // isto ime kao u AuthContext
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== AUTH =====

export interface LoginData {
  login: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

export const loginUser = (data: LoginData) =>
  API.post<AuthResponse>('/auth/login', data);

export const registerUser = (data: RegisterData) =>
  API.post<AuthResponse>('/auth/register', data);

// ===== TRIPS =====

export const getTrips = () => API.get<TripData[]>('/trips');
export const createTrip = (data: TripData) => API.post('/trips', data);
export const getTripById = (id: number) => API.get<TripData>(`/trips/${id}`);

// ===== TRIPS (UPDATE/DELETE) =====
export const updateTrip = (id: number, data: TripData) =>
  API.put(`/trips/${id}`, data);

export const deleteTrip = (id: number) => API.delete(`/trips/${id}`);

export default API;
