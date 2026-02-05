import { useState } from "react";
import { Link } from "react-router-dom";
import type { TripData } from "../api/types";
import { shareTrip, togglePostLike } from "../api/api";
import { useAuth } from "../context/AuthContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60";

interface PostState {
  id: number;
  likes_count: number;
  liked: boolean;
}

interface TripCardProps {
  trip: TripData & {
    post_id?: number;
    likes_count?: number;
    liked?: boolean;
  };
}

const TripCard = ({ trip }: TripCardProps) => {
  const { user } = useAuth();

  // ✅ init iz propsa (bitno!)
  const [post, setPost] = useState<PostState | null>(
    trip.post_id
      ? {
          id: trip.post_id,
          likes_count: trip.likes_count ?? 0,
          liked: !!trip.liked,
        }
      : null
  );

  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!user || loading || trip.user_id === user.id || !trip.id) return;

    try {
      setLoading(true);
      let currentPost = post;

      // ✅ ako post ne postoji → kreiraj
      if (!currentPost) {
        const shareRes = await shareTrip(trip.id);
        currentPost = {
          id: shareRes.data.post.id,
          likes_count: shareRes.data.post.likes_count,
          liked: false,
        };
        setPost(currentPost);
      }

      // ✅ toggle like
      const likeRes = await togglePostLike(currentPost.id);

      setPost((prev) =>
        prev
          ? {
              ...prev,
              liked: likeRes.data.liked,
              likes_count: likeRes.data.liked
                ? prev.likes_count + 1
                : prev.likes_count - 1,
            }
          : prev
      );
    } catch (err) {
      console.error("LIKE ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = trip.image
    ? `http://localhost:8000/storage/${trip.image}`
    : FALLBACK_IMAGE;

  const isLiked = post?.liked ?? false;
  const likesCount = post?.likes_count ?? 0;
  const isOwner = trip.user_id === user?.id;

  return (
    <div className="card tc-card h-100">
      <Link to={`/trips/${trip.id}`} className="text-decoration-none text-dark">
        <div
          className="tc-img"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="p-2">
          <div className="fw-semibold">{trip.title}</div>
          <div className="text-muted" style={{ fontSize: 13 }}>
            {trip.destination}
          </div>
        </div>
      </Link>

      {user && !isOwner && (
        <div className="d-flex justify-content-between align-items-center px-2 pb-2">
          <button
            className="btn btn-sm btn-light"
            onClick={handleLike}
            disabled={loading}
          >
            {isLiked ? "❤️" : "🤍"} {likesCount}
          </button>
          <span className="text-muted" style={{ fontSize: 12 }}>
            {isLiked ? "Liked" : "Click to like"}
          </span>
        </div>
      )}
    </div>
  );
};

export default TripCard;