import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTripById, deleteTrip } from "../api/api";
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
  const [showItinerary, setShowItinerary] = useState(false); // ✅ TOGGLE

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

  const heroImage = trip.image
  ? `http://localhost:8000/storage/${trip.image}`
  : FALLBACK_IMAGE;

  const images = trip.images ?? [];

  return (
    <div className="tc-screen">
      {/* BACK */}
      <Link to="/trips" className="btn btn-outline-secondary tc-pill mb-3">
        ← Back
      </Link>

      {/* HERO IMAGE */}
      <div
        className="trip-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* BASIC INFO */}
      <div className="card tc-card p-3 mb-3">
        <h5 className="mb-1">{trip.title}</h5>
        <div className="text-muted">{trip.destination}</div>

        {trip.description && (
          <p className="trip-description">{trip.description}</p>
        )}

        <div className="mt-2">
          💰 {trip.budget ?? 0} € &nbsp; | &nbsp; 🗓{" "}
          {trip.days?.length ?? 0} days
        </div>

        {/* ✅ TOGGLE ITINERARY */}
        <button
          className="btn btn-outline-primary tc-pill itinerary-toggle"
          onClick={() => setShowItinerary(!showItinerary)}
        >
          {showItinerary ? "Hide itinerary" : "Show itinerary"}
        </button>
      </div>

      {/* ✅ ITINERARY – SAMO KAD JE OTVOREN */}
      {showItinerary && (
        <div className="itinerary-box">
          <h6 className="mb-3">Itinerary</h6>

          {trip.days && trip.days.length > 0 ? (
            trip.days.map((day: any) => (
              <div key={day.id} className="day-card">
                <div className="day-card-header">
                  <strong>
                    Day {day.day_index}
                    {day.title ? ` – ${day.title}` : ""}
                  </strong>
                </div>

                {day.items && day.items.length > 0 ? (
                  day.items.map((item: any) => (
                    <div key={item.id} className="activity-row">
                      <div className="activity-time">
                        {item.start_time ?? "--:--"}
                      </div>
                      <div className="activity-content">
                        {item.title}
                        <div className="text-muted" style={{ fontSize: 12 }}>
                          {item.type}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted">
                    No activities for this day.
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-muted">
              This trip doesn’t have an itinerary yet.
            </div>
          )}
        </div>
      )}

      {/* ✅ GALLERY – SAMO AKO IMA VIŠE SLIKA */}
      {images.length > 1 && (
        <div className="trip-gallery">
          {images.slice(1).map((img: any) => (
            <div
              key={img.id}
              className="tc-img"
              style={{
                backgroundImage: `url(http://localhost:8000/storage/${img.image})`,
              }}
            />
          ))}
        </div>
      )}

      {/* ACTIONS */}
      {isOwner && (
        <div className="d-flex gap-2 mt-4">
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

      {/* DELETE CONFIRM */}
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
    </div>
  );
};

export default TripDetails;