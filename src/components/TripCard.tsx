import { Link } from "react-router-dom";
import type { TripData } from "../api/types";

const TripCard: React.FC<{ trip: TripData }> = ({ trip }) => {
  const imageUrl = (trip as any).image_url as string | undefined;

  return (
    <div className="card tc-card h-100">
      <div
        className="tc-img"
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
      />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div>
            <div className="fw-semibold">{trip.title}</div>
            <div className="text-muted" style={{ fontSize: 12 }}>
              {trip.date}
            </div>
          </div>
          <span className="badge bg-primary tc-pill">€{trip.price}</span>
        </div>

        <div className="text-muted mt-2 text-truncate">{trip.description}</div>

        <div className="mt-3">
          <Link
            to={`/trips/${trip.id}`}
            className="btn btn-sm btn-outline-primary tc-pill"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;