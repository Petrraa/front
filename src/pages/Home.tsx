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
      <div className="home-header">
        <div className="home-welcome">
          <small>Welcome back</small>
          <h5>{user?.name}</h5>
        </div>

        <div
          className="home-avatar"
          onClick={() => navigate("/profile")}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>

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

      <div className="section-header">
        <strong>Recommended for you</strong>
      </div>

      {recommended ? (
        <TripCard trip={recommended} />
      ) : (
        <div className="empty-state">No trips yet ✨</div>
      )}

      <div className="section-header">
        <strong>Popular</strong>
      </div>

      <div className="popular-scroll">
        {popular.map((trip) => (
          <div key={trip.id} style={{ minWidth: 240 }}>
            <TripCard trip={trip} />
          </div>
              ))}
            </div>
          </div>
        );
      };

export default Home;