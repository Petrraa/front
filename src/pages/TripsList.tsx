import { useEffect, useState } from "react";
import { getTrips } from "../api/api";
import { useAuth } from "../context/AuthContext";
import TripCard from "../components/TripCard";

const TripsList = () => {
  const { isAuthenticated } = useAuth();
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

  return (
    <div className="tc-screen">
      <h5 className="mb-3">All Trips</h5>

      {loading && <p>Loading…</p>}

      {!loading && trips.length === 0 && (
        <p className="text-muted">No trips available.</p>
      )}

      <div className="row g-3">
        {trips.map((trip) => (
          <div key={trip.id} className="col-12 col-md-6 col-lg-4">
            <TripCard trip={trip} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripsList;