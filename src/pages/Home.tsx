import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTrips } from "../api/api";
import TripCard from "../components/TripCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
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

  if (loading) {
    return <div className="tc-screen text-muted">Loading trips…</div>;
  }

  const recommended = trips[0];
  const popular = trips.slice(1, 5);

  return (
    <div className="tc-screen">
      <div className="mb-3">
        <div className="text-muted">Welcome back</div>
        <h5>{user?.name}</h5>
      </div>

      <div className="card tc-card p-3 mb-4">
        <h6>AI Travel Assistant</h6>
        <p>Answer a few questions and get a recommendation.</p>
        <button className="btn btn-primary" onClick={() => navigate("/ai")}>
          Start AI
        </button>
      </div>

      <h6>Recommended</h6>
      {recommended ? <TripCard trip={recommended} /> : <p>No trips yet.</p>}

      <h6 className="mt-4">Popular</h6>
      <div className="row g-3">
        {popular.map((trip) => (
          <div key={trip.id} className="col-6">
            <TripCard trip={trip} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;