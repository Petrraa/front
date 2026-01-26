import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTrips } from "../api/api";
import type { TripData } from "../api/types";
import TripCard from "../components/TripCard";

const TripsList = () => {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await getTrips();
        setTrips(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return trips;
    return trips.filter((t) => {
      return (
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    });
  }, [q, trips]);

  return (
    <div className="tc-screen">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            Explore
          </div>
          <h5 className="mb-0">All Trips</h5>
        </div>

        <Link to="/trips/create" className="btn btn-primary btn-sm tc-pill">
          + New
        </Link>
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text tc-pill">
          <i className="bi bi-search" />
        </span>
        <input
          className="form-control tc-pill"
          placeholder="Search trips..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading && <div className="text-muted">Loading trips…</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-muted">No trips found.</div>
      )}

      <div className="row g-3">
        {filtered.map((trip) => (
          <div key={trip.id} className="col-12">
            <TripCard trip={trip} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripsList;