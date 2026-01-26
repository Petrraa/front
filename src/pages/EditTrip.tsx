import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import { fileToBase64 } from "../utils/images";

const EditTrip = () => {
  const { id } = useParams();
  const tripId = Number(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState(0);
  const [isPublic, setIsPublic] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await API.get(`/trips/${tripId}`);
      const trip = res.data.trip;

      setTitle(trip.title);
      setDestination(trip.destination);
      setBudget(trip.budget ?? 0);
      setIsPublic(trip.is_public);

      const stored = localStorage.getItem(`trip_images_${tripId}`);
      if (stored) setImages(JSON.parse(stored));

      setLoading(false);
    })();
  }, [tripId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await API.put(`/trips/${tripId}`, {
      title,
      destination,
      budget,
      is_public: isPublic,
    });

    localStorage.setItem(
      `trip_images_${tripId}`,
      JSON.stringify(images)
    );

    navigate(`/trips/${tripId}`);
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="tc-screen">
      <h5>Edit trip</h5>

      <form className="card tc-card p-3" onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="form-control mb-2"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <input
          type="number"
          className="form-control mb-2"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          className="form-control mb-2"
          onChange={async (e) => {
            if (!e.target.files) return;
            const imgs = await Promise.all(
              Array.from(e.target.files).map((f) => fileToBase64(f))
            );
            setImages((prev) => [...prev, ...imgs]);
          }}
        />

        <div className="row g-2 mb-2">
          {images.map((img, i) => (
            <div key={i} className="col-4">
              <img src={img} className="img-fluid rounded" />
            </div>
          ))}
        </div>

        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label className="form-check-label">Public</label>
        </div>

        <button className="btn btn-primary tc-pill w-100">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditTrip;