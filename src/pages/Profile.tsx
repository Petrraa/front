import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTrips } from "../api/api";
import type { TripData } from "../api/types";
import TripCard from "../components/TripCard";

const Profile = () => {
  const { user, logout } = useAuth();
  const [myTrips, setMyTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMyTrips = async () => {
      try {
        const { data } = await getTrips();

        const ownedTrips = data.trips.filter(
          (t) => t.user_id === user.id
        );

        setMyTrips(ownedTrips);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTrips();
  }, [user]);

  return (
    <div className="tc-screen">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Profile</h5>
        <button
          className="btn btn-outline-danger btn-sm tc-pill"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* USER CARD */}
      <div className="card tc-card p-3 mb-3">
        <div className="d-flex gap-2 align-items-center">
          <i className="bi bi-person-circle fs-1 text-secondary" />
          <div>
            <div className="fw-semibold">{user?.name}</div>
            <div className="text-muted">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* MY TRIPS */}
      <div className="card tc-card p-3">
        <div className="fw-semibold mb-2">My trips</div>

        {loading && <div className="text-muted">Loading…</div>}

        {!loading && myTrips.length === 0 && (
          <div className="text-muted">
            You haven't created any trips yet.
          </div>
        )}

        <div className="row g-2">
          {myTrips.map((trip) => (
            <div key={trip.id} className="col-6">
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;