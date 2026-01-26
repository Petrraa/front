import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteTrip, getTripById } from "../api/api";
import type { TripData } from "../api/types";

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchTrip = async () => {
      try {
        const { data } = await getTripById(Number(id));
        setTrip(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load trip");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const imageUrl = useMemo(() => {
    return (trip as any)?.image_url as string | undefined;
  }, [trip]);

  const handleDelete = async () => {
    if (!trip?.id) return;
    const ok = confirm("Delete this trip?");
    if (!ok) return;

    try {
      await deleteTrip(trip.id);
      navigate("/trips");
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="tc-screen text-muted">Loading trip…</div>;
  if (error) return <div className="tc-screen text-danger">{error}</div>;
  if (!trip) return <div className="tc-screen text-muted">Trip not found.</div>;

  return (
    <div className="tc-screen">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Link to="/trips" className="btn btn-light border tc-pill">
          <i className="bi bi-chevron-left" /> Back
        </Link>

        <div className="d-flex gap-2 no-print">
          <Link
            to={`/trips/edit/${trip.id}`}
            className="btn btn-light border tc-pill"
          >
            <i className="bi bi-pencil" /> Edit
          </Link>

          <button className="btn btn-danger tc-pill" onClick={handleDelete}>
            <i className="bi bi-trash" /> Delete
          </button>

          <button
            className="btn btn-light border tc-pill"
            onClick={() => window.print()}
          >
            <i className="bi bi-printer" /> Print
          </button>
        </div>
      </div>

      <div className="card tc-card mb-3">
        <div
          className="tc-img"
          style={{
            height: 220,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          }}
        />
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <div>
              <h5 className="mb-1">{trip.title}</h5>
              <div className="text-muted" style={{ fontSize: 13 }}>
                {trip.date}
              </div>
            </div>
            <span className="badge bg-primary tc-pill fs-6">€{trip.price}</span>
          </div>

          <p className="text-muted mt-3 mb-0">{trip.description}</p>
        </div>
      </div>

      <div className="card tc-card p-3 mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="fw-semibold">Location</div>
          <span className="text-muted" style={{ fontSize: 12 }}>
            (placeholder)
          </span>
        </div>

        <div className="mt-2">
          <div
            className="tc-img"
            style={{
              height: 180,
              borderRadius: 16,
              backgroundImage:
                "url(https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1200&q=60)",
            }}
          />
          <div className="text-muted mt-2" style={{ fontSize: 13 }}>
            Kasnije: mapa (Google Maps/Leaflet) i prava lokacija iz baze.
          </div>
        </div>
      </div>

      <div className="card tc-card p-3">
        <div className="fw-semibold mb-2">Gallery</div>

        <div className="row g-2">
          {[1, 2, 3, 4].map((x) => (
            <div key={x} className="col-6">
              <div
                className="tc-img"
                style={{
                  height: 120,
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60)",
                }}
              />
            </div>
          ))}
        </div>

        <div className="text-muted mt-2" style={{ fontSize: 13 }}>
          Kasnije: upload više slika i spremanje u backend.
        </div>
      </div>
    </div>
  );
};

export default TripDetails;