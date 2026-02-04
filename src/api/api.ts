import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
  },
});

// ✅ AUTOMATSKI DODAJ TOKEN NA SVAKI REQUEST
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;

// ================= AUTH =================

export const loginUser = (data: {
  login: string;
  password: string;
}) => API.post("/auth/login", data);

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => API.post("/auth/register", data);

export const logoutUser = () => API.post("/auth/logout");

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// ================= TRIPS =================
export const getTrips = () => API.get("/trips");

export const getTripById = (id: number) => API.get(`/trips/${id}`);

export const createTrip = (data: FormData) =>
  API.post("/trips", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteTrip = (id: number) => API.delete(`/trips/${id}`);

// ================= POSTS =================
export const getPosts = () => API.get("/posts");

export const togglePostLike = (postId: number) =>
  API.post(`/posts/${postId}/like`);

// ================= AI =================
export const applyItinerary = (payload: any) =>
  API.post("/ai/plan-and-apply", payload); 

export const generateAIPlan = (payload: any) =>
  API.post("/ai/plan", payload);

// ================= SHARE / FORK =================
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