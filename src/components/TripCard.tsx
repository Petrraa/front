import { Link } from "react-router-dom";
import type { TripData } from "../api/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60";

const TripCard = ({ trip }: { trip: TripData }) => {
  const imageUrl = trip.image
    ? `http://localhost:8000/storage/${trip.image}`
    : FALLBACK_IMAGE;

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="text-decoration-none text-dark"
    >
      <div className="card tc-card trip-card h-100">
        {/* IMAGE */}
        <div
          className="trip-card-image"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        {/* BODY */}
        <div className="trip-card-body">
          <div className="trip-card-title">
            {trip.title}
          </div>
          <div className="trip-card-destination">
            {trip.destination}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;