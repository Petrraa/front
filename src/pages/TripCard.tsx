import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { TripData } from "../api/types";
import { getPosts, togglePostLike } from "../api/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60";

interface Post {
  id: number;
  trip_id: number;
  likes_count?: number;
  liked?: boolean;
}

const TripCard = ({ trip }: { trip: TripData }) => {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPosts();
        const posts: Post[] = res.data.posts ?? res.data ?? [];
        const found = posts.find((p) => p.trip_id === trip.id);
        if (found) setPost(found);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [trip.id]);

  const handleLike = async () => {
    if (!post) return;
    const res = await togglePostLike(post.id);
    setPost((prev) =>
      prev
        ? {
            ...prev,
            liked: res.data.liked,
            likes_count: res.data.liked
              ? (prev.likes_count ?? 0) + 1
              : (prev.likes_count ?? 1) - 1,
          }
        : prev
    );
  };

  const coverImage = trip.image
    ? `http://localhost:8000/storage/${trip.image}`
    : FALLBACK_IMAGE;

  return (
    <div className="card tc-card h-100">
      <Link to={`/trips/${trip.id}`} className="text-decoration-none text-dark">
        <div
          className="tc-img"
          style={{ height: 140, backgroundImage: `url(${coverImage})` }}
        />
        <div className="p-2">
          <div className="fw-semibold">{trip.title}</div>
          <div className="text-muted" style={{ fontSize: 13 }}>
            {trip.destination}
          </div>
        </div>
      </Link>

      {post && (
        <div className="d-flex justify-content-between px-2 pb-2">
          <button className="btn btn-sm btn-light" onClick={handleLike}>
            {post.liked ? "❤️" : "🤍"} {post.likes_count ?? 0}
          </button>
          <span className="text-muted" style={{ fontSize: 12 }}>
            Shared
          </span>
        </div>
      )}
    </div>
  );
};

export default TripCard;