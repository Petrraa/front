import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTrips } from "../api/api";
import TripCard from "../components/TripCard";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchTrips = async () => {
      const res = await getTrips();
      setTrips(res.data.trips ?? res.data ?? []);
    };

    fetchTrips();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="tc-screen text-muted">Loading…</div>;
  }

  return (
    <div className="tc-screen">
      <h5>Profile</h5>

      <div className="card tc-card p-3 mb-3">
        <div><strong>Name:</strong> {user?.name}</div>
        <div><strong>Email:</strong> {user?.email}</div>

        <button className="btn btn-outline-danger mt-2" onClick={logout}>
          Logout
        </button>
      </div>

      <h6>My trips</h6>
      <div className="row g-3">
        {trips.map((trip) => (
          <div key={trip.id} className="col-6">
            <TripCard trip={trip} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;