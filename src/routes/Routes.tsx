import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Login from "../pages/login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import TripsList from "../pages/TripsList";
import TripDetails from "../pages/TripDetails";
import CreateTrip from "../pages/CreateTrip";
import EditTrip from "../pages/EditTrip";
import Profile from "../pages/Profile";
import AI from "../pages/AI";

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} />

      <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
      <Route path="/trips" element={isAuthenticated ? <TripsList /> : <Navigate to="/login" />} />
      <Route path="/trips/create" element={isAuthenticated ? <CreateTrip /> : <Navigate to="/login" />} />
      <Route path="/trips/edit/:id" element={isAuthenticated ? <EditTrip /> : <Navigate to="/login" />} />
      <Route path="/trips/:id" element={isAuthenticated ? <TripDetails /> : <Navigate to="/login" />} />
      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/ai" element={isAuthenticated ? <AI /> : <Navigate to="/login" />} />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default AppRoutes;