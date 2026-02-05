import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrips } from "../api/api";
import { useAuth } from "../context/AuthContext";
import TripCard from "../components/TripCard";

const TripsList = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchTrips = async () => {
      try {
        const res = await getTrips();
        const allTrips = res.data.trips ?? res.data ?? [];

        const publicTrips = allTrips.filter(
          (trip: any) =>
            trip.is_public && trip.user_id !== user?.id
        );

        setTrips(publicTrips);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <div className="tc-screen text-muted">Loading…</div>;
  }

  return (
    <div className="tc-screen">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Trips</h5>

        <button
          className="btn btn-primary tc-pill"
          onClick={() => navigate("/trips/create")}
        >
          + New trip
        </button>
      </div>

      {loading && <div className="text-muted">Loading trips…</div>}

      {!loading && trips.length === 0 && (
        <div className="text-muted mt-3">
          No public trips available.
        </div>
      )}

      <div className="row g-3 mt-2">
        {trips.map((trip) => (
          <div key={trip.id} className="col-12 col-md-6">
            <TripCard trip={trip} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripsList;