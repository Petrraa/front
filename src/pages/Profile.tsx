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

  // ✅ FRONTEND COVER (localStorage)
  const [coverImage, setCoverImage] = useState<string | null>(
    localStorage.getItem("profileCover")
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const tripsRes = await getTrips();
        const trips = tripsRes.data.trips ?? tripsRes.data ?? [];
        setMyTrips(trips.filter((t: any) => t.user_id === user?.id));

        const postsRes = await getPosts();
        const posts = postsRes.data.posts ?? postsRes.data ?? [];
        setLikedTrips(
          posts.filter((p: any) => p.liked).map((p: any) => p.trip)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      localStorage.setItem("profileCover", base64);
      setCoverImage(base64);
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated) {
    return <div className="tc-screen text-muted">Loading…</div>;
  }

  return (
    <div className="tc-screen">
      {/* ✅ PROFILE COVER */}
      <div
        className="profile-cover"
        style={{
          backgroundImage: coverImage
            ? `url(${coverImage})`
            :  `url("https://plus.unsplash.com/premium_photo-1679830513869-cd3648acb1db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D")`,
        }}
      >
        <label className="cover-edit-btn">
          ✎
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleCoverChange}
          />
        </label>

        <div className="profile-avatar-large">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* ✅ PROFILE INFO + STATS DESNO */}
      <div className="profile-info-row">
        <div className="profile-info-text">
          <h5>{user?.name}</h5>
          <div className="email">{user?.email}</div>
        </div>

        <div className="profile-stats-right">
          <div>
            <strong>{myTrips.length}</strong>
            <span>Trips</span>
          </div>
          <div>
            <strong>{likedTrips.length}</strong>
            <span>Likes</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          My trips
        </button>
        <button
          className={`profile-tab ${activeTab === "liked" ? "active" : ""}`}
          onClick={() => setActiveTab("liked")}
        >
          Liked trips
        </button>
      </div>

      {/* CONTENT */}
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