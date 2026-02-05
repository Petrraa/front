import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTrips, getPosts } from "../api/api";
import TripCard from "../components/TripCard";

type Tab = "my" | "liked";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("my");

  const [myTrips, setMyTrips] = useState<any[]>([]);
  const [likedTrips, setLikedTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const tripsRes = await getTrips();
        const trips = tripsRes.data.trips ?? tripsRes.data ?? [];
        const onlyMyTrips = trips.filter(
          (trip: any) => trip.user_id === user?.id
        );

        setMyTrips(onlyMyTrips);

        const postsRes = await getPosts();
        const posts = postsRes.data.posts ?? postsRes.data ?? [];
        const liked = posts
          .filter((p: any) => p.liked)
          .map((p: any) => p.trip);

        setLikedTrips(liked);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="tc-screen text-muted">Loading…</div>;
  }

  return (
    <div className="tc-screen">
      <div className="mb-3">
        <h5 className="mb-0">{user?.name}</h5>
        <div className="text-muted" style={{ fontSize: 13 }}>
          {user?.email}
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${
            activeTab === "my" ? "active" : ""
          }`}
          onClick={() => setActiveTab("my")}
        >
          My trips
        </button>

        <button
          className={`profile-tab ${
            activeTab === "liked" ? "active" : ""
          }`}
          onClick={() => setActiveTab("liked")}
        >
          Liked trips
        </button>
      </div>

      {loading && <div className="text-muted">Loading…</div>}

      {!loading && activeTab === "my" && (
        <>
          {myTrips.length === 0 && (
            <div className="text-muted">No trips yet.</div>
          )}

          <div className="row g-3">
            {myTrips.map((trip) => (
              <div key={trip.id} className="col-12">
                <TripCard trip={trip} />
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && activeTab === "liked" && (
        <>
          {likedTrips.length === 0 && (
            <div className="text-muted">
              You haven’t liked any trips yet.
            </div>
          )}

          <div className="row g-3">
            {likedTrips.map((trip) => (
              <div key={trip.id} className="col-12">
                <TripCard trip={trip} />
              </div>
            ))}
          </div>
        </>
      )}

      <button
        className="btn btn-outline-danger w-100 mt-4"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;