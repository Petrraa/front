import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteTrip,
  getTripById,
  forkTrip,
  shareTrip,
  applyItinerary,
} from "../api/api";
import { useAuth } from "../context/AuthContext";

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trip, setTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingAI, setApplyingAI] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await getTripById(Number(id));
      setTrip(data.trip);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="tc-screen">Loading…</div>;
  if (!trip) return <div className="tc-screen">Trip not found.</div>;

  const isOwner = user?.id === trip.user_id;
  const imageUrl = trip.image
    ? `http://localhost:8000/storage/${trip.image}`
    : null;

  return (
    <div className="tc-screen">
      <div className="d-flex justify-content-between mb-3">
        <Link to="/trips" className="btn btn-outline-secondary tc-pill">
          ← Back
        </Link>

        <div className="d-flex gap-2">
          {!isOwner && trip.is_public && (
            <button
              className="btn btn-outline-primary tc-pill"
              onClick={() => forkTrip(trip.id)}
            >
              Fork
            </button>
          )}

          {isOwner && (
            <>
              <button
                className="btn btn-success tc-pill"
                onClick={async () => {
                  setApplyingAI(true);
                  await applyItinerary({
                    trip_id: trip.id,
                    destination: trip.destination,
                    days: trip.days?.length || 3,
                    pace: "normalno",
                    interests: ["hrana", "kultura"],
                    replace: true,
                  });
                  const refreshed = await getTripById(trip.id);
                  setTrip(refreshed.data.trip);
                  setApplyingAI(false);
                }}
              >
                {applyingAI ? "Applying AI..." : "Apply AI itinerary"}
              </button>

              <button
                className="btn btn-outline-primary tc-pill"
                onClick={() => shareTrip(trip.id)}
              >
                Share
              </button>

              <Link
                to={`/trips/edit/${trip.id}`}
                className="btn btn-outline-secondary tc-pill"
              >
                Edit
              </Link>

              <button
                className="btn btn-danger tc-pill"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {imageUrl && (
        <img src={imageUrl} className="img-fluid rounded mb-3" />
      )}

      <div className="card tc-card p-3 mb-3">
        <h5>{trip.title}</h5>
        <div className="text-muted">{trip.destination}</div>
        <div className="mt-2">💰 {trip.budget ?? 0} €</div>
      </div>

      {showDeleteModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Delete trip</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to delete <b>{trip.title}</b>?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    await deleteTrip(trip.id);
                    navigate("/trips");
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;