import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTrips } from "../api/api";
import TripCard from "../components/TripCard";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchTrips = async () => {
      try {
        const res = await getTrips();
        setTrips(res.data.trips ?? res.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="tc-screen text-muted">Loading…</div>;
  }

  if (loading) {
    return <div className="tc-screen text-muted">Loading trips…</div>;
  }

  const lastTrip = trips[0];
  const visited = trips.slice(1, 5);

  return (
    <div className="tc-screen">
      {/* HEADER */}
      <div className="profile-header">
        <h5>{user?.name}</h5>
        <div className="email">{user?.email}</div>
      </div>

      {/* LAST TRIP */}
      <div className="profile-section">
        <strong>Last trip</strong>

        <div className="mt-2">
          {lastTrip ? (
            <TripCard trip={lastTrip} />
          ) : (
            <div className="empty-state">No trips yet.</div>
          )}
        </div>
      </div>

      {/* VISITED */}
      <div className="profile-section">
        <strong>Visited</strong>

        {visited.length > 0 ? (
          <div className="visited-grid">
            {visited.map((trip) => (
              <div
                key={trip.id}
                className="tc-img"
                style={{
                  backgroundImage: `url(${
                    trip.image
                      ? `http://localhost:8000/storage/${trip.image}`
                      : "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                  })`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">No visited trips.</div>
        )}
      </div>

      {/* LOGOUT */}
      <button
        className="btn btn-outline-danger w-100 profile-logout"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;