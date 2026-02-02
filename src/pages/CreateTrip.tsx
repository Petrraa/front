import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createTrip } from "../api/api";


const CreateTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiGenerated, setAiGenerated] = useState(false);

  // ✅ PODACI IZ AI MODULA
  useEffect(() => {
    if (!location.state) return;

    if (location.state.destination) {
      setDestination(location.state.destination);
      setAiGenerated(true);
    }

    if (location.state.budget) {
      setBudget(location.state.budget);
    }
  }, [location.state]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files).slice(0, 1)); // ✅ samo cover slika
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      // ✅ OBAVEZNA POLJA
      formData.append("title", title);
      formData.append("destination", destination);

      // ✅ BACKEND OČEKUJE start_date
      const today = new Date().toISOString().slice(0, 10);
      formData.append("start_date", today);

      // ✅ OPCIONALNA POLJA
      formData.append("description", description);
      if (budget !== null) {
        formData.append("budget", String(budget));
      }
      formData.append("is_public", isPublic ? "1" : "0");

      // ✅ SLIKA
      if (images.length > 0) {
        formData.append("image", images[0]);
      }

      await createTrip(formData);
      navigate("/trips");
    } catch (err) {
      console.error(err);
      setError("Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tc-screen">
      <h5>Create new trip</h5>

      {aiGenerated && (
        <div className="alert alert-info py-2">
          This trip is based on an AI recommendation ✨
        </div>
      )}

      <form className="card tc-card p-3" onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <input
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Budget"
          value={budget ?? ""}
          onChange={(e) =>
            setBudget(e.target.value ? Number(e.target.value) : null)
          }
        />

        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="form-control mb-2"
          onChange={handleImageChange}
        />

        {images[0] && (
          <img
            src={URL.createObjectURL(images[0])}
            className="img-fluid rounded mb-2"
            alt="preview"
          />
        )}

        <div className="form-check my-2">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label className="form-check-label">Public</label>
        </div>

        <button className="btn btn-primary tc-pill w-100" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;