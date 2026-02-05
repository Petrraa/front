import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
  },
});

// token interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;

// auth

export interface RegisterData {
  name: string;  
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const loginUser = (data: {
  login: string;
  password: string;
}) => API.post("/auth/login", data);

export const registerUser = (data: RegisterData) =>
  API.post("/auth/register", data);

export const logoutUser = () => API.post("/auth/logout");


// trips
export const getTrips = () => API.get("/trips");

export const getTripById = (id: number) => API.get(`/trips/${id}`);

export const createTrip = (data: FormData) =>
  API.post("/trips", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteTrip = (id: number) => API.delete(`/trips/${id}`);

// posts
export const getPosts = () => API.get("/posts");

export const togglePostLike = (postId: number) =>
  API.post(`/posts/${postId}/like`);

// ai
export const applyItinerary = (payload: any) =>
  API.post("/ai/plan-and-apply", payload); 

export const generateAIPlan = (payload: any) =>
  API.post("/ai/plan", payload);

// share/fork
export const forkTrip = (id: number) => API.post(`/trips/${id}/fork`);

export const shareTrip = (id: number) => API.post(`/posts`, { trip_id: id });

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);