import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import  Login  from '../pages/login';
import {Register} from '../pages/Register';
import TripsList from '../pages/TripsList';
import TripDetails from '../pages/TripDetails';
import Feed from '../pages/Feed';
import CreateTrip from '../pages/CreateTrip';

const AppRoutes = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/trips" replace />} />

      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/trips" replace />}
      />

      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/trips" replace />}
      />

      <Route
        path="/trips"
        element={isAuthenticated ? <TripsList /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/trips/create"
        element={isAuthenticated ? <CreateTrip /> : <Navigate to="/login" />}
      />

      <Route
        path="/trips/:id"
        element={isAuthenticated ? <TripDetails /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/feed"
        element={isAuthenticated ? <Feed /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
