import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { TripData } from "../api/types";
import { getTripById, updateTrip } from "../api/api";
import TripForm from "../components/TripForm";

const EditTrip = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initial, setInitial] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const { data } = await getTripById(Number(id));
        setInitial(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load trip for edit");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleUpdate = async (data: TripData) => {
    await updateTrip(Number(id), data);
    navigate(`/trips/${id}`);
  };

  return (
    <div className="tc-screen">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Link to={`/trips/${id}`} className="btn btn-light border tc-pill">
          <i className="bi bi-chevron-left" /> Back
        </Link>
        <div className="fw-semibold">Edit Trip</div>
        <div style={{ width: 72 }} />
      </div>

      {loading && <div className="text-muted">Loading…</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {!loading && initial && (
        <TripForm initial={initial} onSubmit={handleUpdate} submitLabel="Update" />
      )}
    </div>
  );
};

export default EditTrip;