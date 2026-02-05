import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createTrip } from "../api/api";

const CreateTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [budget, setBudget] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiGenerated, setAiGenerated] = useState(false);

  useEffect(() => {
    if (!location.state) return;
    if (location.state.destination) {
      setDestination(location.state.destination);
      setAiGenerated(true);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      // ✅ BASIC INFO
      formData.append("title", title);
      formData.append("destination", destination);
      formData.append("start_date", startDate);

      // ✅ OPTIONAL
      formData.append("description", description);
      if (budget !== null) formData.append("budget", String(budget));
      formData.append("is_public", isPublic ? "1" : "0");

      // ✅ COVER IMAGE
      if (image) formData.append("image", image);

      // ✅ GALLERY
      galleryImages.forEach((img) => {
        if (img.size > 2 * 1024 * 1024) {
          throw new Error("Each gallery image must be smaller than 2 MB.");
        }
        formData.append("images[]", img);
      });

      await createTrip(formData);
      navigate("/trips");
    } catch (err: any) {
      console.error("CREATE TRIP ERROR:", err.response?.data);
      setError(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data?.errors) ||
          err.message ||
          "Failed to create trip"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tc-screen">
      <h5 className="mb-3">Create new trip</h5>

      {aiGenerated && (
        <div className="alert alert-info">
          This trip is based on an AI recommendation ✨
        </div>
      )}

      <form className="card tc-card create-card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* ===== BASIC INFORMATION ===== */}
        <h6 className="form-section-title">Basic information</h6>

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
          type="date"
          className="form-control mb-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
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

        {/* ===== COVER IMAGE ===== */}
        <h6 className="form-section-title">Cover image</h6>

        {image && (
          <div
            className="image-preview"
            style={{
              backgroundImage: `url(${URL.createObjectURL(image)})`,
            }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          className="form-control mb-3"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.size > 2 * 1024 * 1024) {
              setError("Image must be smaller than 2 MB.");
              e.target.value = "";
              setImage(null);
              return;
            }

            setError("");
            setImage(file);
          }}
        />

        {/* ===== GALLERY ===== */}
        <h6 className="form-section-title">Gallery</h6>

        <input
          type="file"
          multiple
          accept="image/*"
          className="form-control mb-2"
          onChange={(e) =>
            setGalleryImages(Array.from(e.target.files ?? []))
          }
        />

        <small className="text-muted">
          You can add multiple images (max 2 MB each).
        </small>

        {/* ===== VISIBILITY ===== */}
        <h6 className="form-section-title">Visibility</h6>

        <div className="form-check mb-3 mt-2">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label className="form-check-label">Public</label>
        </div>

        {/* ===== CREATE BUTTON ===== */}
        <button
          className="btn create-trip-btn w-100"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create trip"}
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;