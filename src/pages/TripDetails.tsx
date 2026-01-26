import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteTrip,
  getTripById,
  forkTrip,
  shareTrip,
} from "../api/api";
import type { TripData } from "../api/types";
import { useAuth } from "../context/AuthContext";

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forking, setForking] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchTrip = async () => {
      try {
        const { data } = await getTripById(Number(id));
        setTrip(data.trip);
      } catch (err) {
        console.error(err);
        setError("Ne mogu učitati putovanje");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleDelete = async () => {
    if (!trip?.id) return;
    if (!confirm("Delete this trip?")) return;

    try {
      await deleteTrip(trip.id);
      navigate("/trips");
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  const handleFork = async () => {
    if (!trip) return;

    setForking(true);
    try {
      const res = await forkTrip(trip.id);
      const newTripId = res.data.trip?.id;

      if (newTripId) {
        navigate(`/trips/${newTripId}`);
      } else {
        navigate("/trips");
      }
    } catch (e) {
      console.error(e);
      alert("Fork nije uspio");
    } finally {
      setForking(false);
    }
  };

  if (loading) return <div className="tc-screen text-muted">Loading…</div>;
  if (error) return <div className="tc-screen text-danger">{error}</div>;
  if (!trip) return <div className="tc-screen">Trip not found.</div>;

  const isOwner = user?.id === trip.user_id;

  return (
    <div className="tc-screen">
      <div className="d-flex justify-content-between mb-3">
        <Link to="/trips" className="btn btn-light tc-pill">
          ← Back
        </Link>

        <div className="d-flex gap-2">
          {!isOwner && trip.is_public && (
            <button
              className="btn btn-outline-primary tc-pill"
              onClick={handleFork}
              disabled={forking}
            >
              {forking ? "Forking..." : "Fork"}
            </button>
          )}

          {isOwner && (
            <>
              <button
                className="btn btn-outline-primary tc-pill"
                onClick={async () => {
                  try {
                    await shareTrip(trip.id);
                    alert("Trip shared!");
                  } catch {
                    alert("This trip is already shared.");
                  }
                }}
              >
                Share
              </button>

              <Link
                to={`/trips/edit/${trip.id}`}
                className="btn btn-light tc-pill"
              >
                Edit
              </Link>

              <button
                className="btn btn-danger tc-pill"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card tc-card p-3">
        <h5 className="mb-1">{trip.title}</h5>
        <div className="text-muted">{trip.destination}</div>

        <div className="mt-2">
          💰 Budget: <strong>{trip.budget ?? 0} €</strong>
        </div>

        {trip.is_public && (
          <span className="badge bg-success mt-2">Public</span>
        )}
      </div>
    </div>
  );
};

export default TripDetails;