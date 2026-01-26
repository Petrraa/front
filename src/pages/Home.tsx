import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrips } from "../api/api";
import type { TripData } from "../api/types";
import TopBar from "../components/TopBar";
import TripCard from "../components/TripCard";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await getTrips();
        setTrips(data.trips); // ✅ JEDINO ISPRAVNO
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // ✅ samo public tripovi drugih usera
  const publicTrips = trips.filter(
    (t) => t.is_public && t.user_id !== user?.id
  );

  const recommended = publicTrips[0];
  const popular = publicTrips.slice(1, 7);

  return (
    <div className="tc-screen">
      <TopBar />

      {/* HERO */}
      <div className="tc-hero p-4 mb-3">
        <div className="fw-semibold">AI Travel Assistant</div>
        <div className="opacity-75" style={{ fontSize: 14 }}>
          Answer a few questions and get a recommendation.
        </div>
        <Link to="/ai" className="btn btn-light tc-pill mt-3">
          Start AI
        </Link>
      </div>

      {/* RECOMMENDED */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">Recommended</h6>
        <Link
          to="/trips"
          className="text-decoration-none"
          style={{ fontSize: 13 }}
        >
          See all
        </Link>
      </div>

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : recommended ? (
        <TripCard trip={recommended} />
      ) : (
        <div className="text-muted">No recommended trips yet.</div>
      )}

      {/* POPULAR */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <h6 className="mb-0">Popular</h6>
        <Link
          to="/trips/create"
          className="btn btn-sm btn-primary tc-pill"
        >
          + New trip
        </Link>
      </div>

      <div className="row g-3">
        {popular.map((t) => (
          <div key={t.id} className="col-6">
            <TripCard trip={t} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;