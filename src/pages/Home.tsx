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
        const allTrips = res.data.trips ?? res.data ?? [];

        // ✅ SAMO TUĐI PUBLIC TRIPOVI
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

  if (loading) {
    return <div className="tc-screen text-muted">Loading trips…</div>;
  }

  const recommended = trips[0];
  const popular = trips.slice(1, 6);

  return (
    <div className="tc-screen">
      {/* WELCOME */}
      <div className="home-welcome">
        <small>Welcome back</small>
        <h5>{user?.name}</h5>
      </div>

      {/* AI CTA */}
      <div className="home-ai-card mb-4">
        <strong>AI Travel Assistant</strong>
        <p>Answer a few questions and get a recommendation.</p>
        <button
          className="btn btn-light"
          onClick={() => navigate("/ai")}
        >
          Start AI
        </button>
      </div>

      {/* RECOMMENDED */}
      <div className="section-header">
        <strong>Recommended</strong>
        <span
          className="see-all"
          onClick={() => navigate("/trips")}
        >
          See all
        </span>
      </div>

      {recommended ? (
        <TripCard trip={recommended} />
      ) : (
        <div className="empty-state">No trips yet.</div>
      )}

      {/* POPULAR */}
      <div className="section-header">
        <strong>Popular</strong>
      </div>

      {popular.length > 0 ? (
        <div className="popular-scroll">
          {popular.map((trip) => (
            <div key={trip.id}>
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">No popular trips.</div>
      )}
    </div>
  );
};

export default Home;