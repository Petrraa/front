import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTripById, deleteTrip, forkTrip } from "../api/api";
import { useAuth } from "../context/AuthContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60";

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trip, setTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [forking, setForking] = useState(false);
  const [forkError, setForkError] = useState("");

  useEffect(() => {
    if (!id) return;

    (async () => {
      const res = await getTripById(Number(id));
      setTrip(res.data.trip);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="tc-screen">Loading…</div>;
  if (!trip) return <div className="tc-screen">Trip not found.</div>;

  const isOwner = user?.id === trip.user_id;

  const handleFork = async () => {
    if (!trip || forking) return;

    try {
      setForking(true);
      setForkError("");

      const res = await forkTrip(trip.id);
      const newTripId = res.data.trip.id;

      navigate(`/trips/${newTripId}`);
    } catch (err: any) {
      setForkError(
        err.response?.data?.message || "Fork failed"
      );
    } finally {
      setForking(false);
    }
  };

  const heroImage = trip.image
    ? `http://localhost:8000/storage/${trip.image}`
    : FALLBACK_IMAGE;

  const images = trip.images ?? [];

  return (
    <div className="tc-screen">
      <Link to="/trips" className="btn btn-outline-secondary tc-pill mb-3">
        ← Back
      </Link>

      <div
        className="trip-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      <div className="card tc-card p-3 mb-3">
        <h5 className="mb-1">{trip.title}</h5>
        <div className="text-muted">{trip.destination}</div>

        {trip.description && <p>{trip.description}</p>}

        <div className="mt-2">
          💰 {trip.budget ?? 0} € &nbsp; | &nbsp; 🗓{" "}
          {trip.days?.length ?? 0} days
        </div>

        <button
          className="btn btn-outline-primary tc-pill mt-2"
          onClick={() => setShowItinerary(!showItinerary)}
        >
          {showItinerary ? "Hide itinerary" : "Show itinerary"}
        </button>
      </div>

      {showItinerary && (
        <div className="itinerary-wrap">
          {trip.days?.map((day: any) => (
            <div key={day.id} className="day-card">
              <div className="day-card-header">
                <strong>Day {day.day_index}</strong>
              </div>

              {day.items?.length ? (
                day.items.map((item: any) => (
                  <div key={item.id} className="activity-row">
                    <div className="activity-time">
                      {item.start_time ?? "--:--"}
                    </div>
                    <div className="activity-content">
                      {item.title}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted">No activities.</div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="trip-gallery">
          {images.slice(1).map((img: any) => {
            const url = `http://localhost:8000/storage/${img.image}`;
            return (
              <div
                key={img.id}
                className="tc-img gallery-img"
                style={{ backgroundImage: `url(${url})` }}
                onClick={() => setSelectedImage(url)}
              />
            );
          })}
        </div>
      )}

      <div className="mt-4">
        {isOwner && (
          <div className="d-flex gap-2">
            <Link
              to={`/trips/edit/${trip.id}`}
              className="btn btn-outline-primary tc-pill w-100"
            >
              Edit
            </Link>

            <button
              className="btn btn-danger tc-pill w-100"
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
          </div>
        )}

        {!isOwner && trip.is_public && (
          <div className="mt-3">
            <button
              className="btn btn-outline-success tc-pill w-100"
              onClick={handleFork}
              disabled={forking}
            >
              {forking ? "Forking..." : "Fork this trip"}
            </button>

            {forkError && (
              <div className="text-danger mt-2" style={{ fontSize: 13 }}>
                {forkError}
              </div>
            )}
          </div>
        )}
      </div>

      {showDelete && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Delete trip</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowDelete(false)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to delete <b>{trip.title}</b>?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setShowDelete(false)}
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

      {selectedImage && (
        <div
          className="gallery-modal"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedImage} alt="Preview" />
            <button
              className="gallery-close"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;