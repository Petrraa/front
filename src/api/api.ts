import axios from 'axios';
import type { TripData } from './types';

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
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

export const getTrips = () =>
  API.get<{ trips: TripData[] }>("/trips");
export const createTrip = (data: TripData) => API.post('/trips', data);
export const getTripById = (id: number) =>
  API.get<{ trip: TripData }>(`/trips/${id}`);


// ===== TRIPS (UPDATE/DELETE) =====
export const updateTrip = (id: number, data: TripData) =>
  API.put(`/trips/${id}`, data);

export const deleteTrip = (id: number) => API.delete(`/trips/${id}`);
export const logoutUser = () => API.post("/auth/logout");

export const forkTrip = (tripId: number) =>
  API.post(`/trips/${tripId}/fork`);

export const getPosts = () => API.get("/posts");
export const togglePostLike = (postId: number) =>
  API.post(`/posts/${postId}/like`);

export const shareTrip = (tripId: number) =>
  API.post("/posts", { trip_id: tripId });

export const toggleLike = (postId: number) =>
  API.post(`/posts/${postId}/like`);

export default API;
