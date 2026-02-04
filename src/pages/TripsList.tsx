import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrips } from "../api/api";
import { useAuth } from "../context/AuthContext";
import TripCard from "../components/TripCard";

const TripsList = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
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

  return (
    <div className="tc-screen">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Trips</h5>

        {/* ✅ NEW TRIP BUTTON */}
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
          You don’t have any trips yet.  
          Create your first trip!
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