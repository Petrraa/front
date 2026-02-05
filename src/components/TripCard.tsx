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
    is_public?: boolean;
  };
}

const TripCard = ({ trip }: TripCardProps) => {
  const { user } = useAuth();

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

  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || loading || trip.user_id === user.id || !trip.id) return;

    try {
      setLoading(true);
      let currentPost = post;

      if (!currentPost) {
        const shareRes = await shareTrip(trip.id);
        currentPost = {
          id: shareRes.data.post.id,
          likes_count: shareRes.data.post.likes_count,
          liked: false,
        };
        setPost(currentPost);
      }

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
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = trip.image
    ? `http://localhost:8000/storage/${trip.image}`
    : FALLBACK_IMAGE;

  return (
    <Link to={`/trips/${trip.id}`} className="trip-card-link">
      <div className="trip-card instagram-card">
        <div
          className="trip-card-image-full"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >

          {user && trip.user_id !== user.id && (
            <button
              className={`like-btn ${post?.liked ? "liked" : ""}`}
              onClick={handleLike}
            >
              {post?.liked ? "❤️" : "🤍"}
            </button>
          )}

          <div className="trip-card-overlay">
            <h6>{trip.title}</h6>
            <small>{trip.destination}</small>
          </div>
        </div>

        <div className="trip-card-footer">
          <span>
            {post?.likes_count ?? 0} likes
          </span>
          <span className="text-muted">
            {trip.is_public ? "Public" : "Private"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;