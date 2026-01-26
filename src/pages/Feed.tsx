import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

interface Post {
  id: number;
  caption: string;
  likes_count?: number;
  liked?: boolean;
  trip: {
    id: number;
    title: string;
    destination: string;
  };
  user: {
    id: number;
    username: string;
  };
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/posts");
        setPosts(res.data.posts ?? res.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleLike = async (postId: number) => {
    try {
      const res = await API.post(`/posts/${postId}/like`);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                liked: res.data.liked,
                likes_count: res.data.liked
                  ? (p.likes_count ?? 0) + 1
                  : (p.likes_count ?? 1) - 1,
              }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="tc-screen">Loading…</div>;

  return (
    <div className="tc-screen">
      <h5 className="mb-3">Feed</h5>

      {posts.length === 0 && (
        <div className="text-muted">No posts yet.</div>
      )}

      <div className="d-flex flex-column gap-3">
        {posts.map((post) => (
          <div key={post.id} className="card tc-card p-3">
            <div className="fw-semibold mb-1">
              @{post.user.username}
            </div>

            <Link
              to={`/trips/${post.trip.id}`}
              className="text-decoration-none"
            >
              <div className="fw-semibold">{post.trip.title}</div>
              <div className="text-muted" style={{ fontSize: 13 }}>
                {post.trip.destination}
              </div>
            </Link>

            {post.caption && (
              <div className="mt-2">{post.caption}</div>
            )}

            <button
              className="btn btn-sm btn-light mt-2"
              onClick={() => toggleLike(post.id)}
            >
              {post.liked ? "❤️" : "🤍"}{" "}
              {post.likes_count ?? 0}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;