import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import { fileToBase64 } from "../utils/images";

type TripType = "planned" | "visited";

const CreateTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tripType, setTripType] = useState<TripType>("planned");
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiGenerated, setAiGenerated] = useState(false);

  // ✅ PRIMI PODATKE IZ AI MODULA
  useEffect(() => {
    if (!location.state) return;

    if (location.state.destination) {
      setDestination(location.state.destination);
      setAiGenerated(true);
    }

    if (location.state.budget) {
      setBudget(location.state.budget);
    }

    if (location.state.tripType) {
      setTripType(location.state.tripType);
    }
  }, [location.state]);

  // ✅ LIMIT NA MAX 3 SLIKE
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).slice(0, 3);
    setImages(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/trips", {
        title,
        destination,
        budget,
        is_public: isPublic,
      });

      const createdTrip = res.data.trip;

      // ✅ SPREMI SAMO COVER SLIKU
      if (tripType === "visited" && images.length > 0) {
        try {
          const coverImage = await fileToBase64(images[0]);
          localStorage.setItem(
            `trip_images_${createdTrip.id}`,
            JSON.stringify([coverImage])
          );
        } catch {
          console.warn(
            "Image not saved due to storage limits."
          );
        }
      }

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
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

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
            setBudget(
              e.target.value ? Number(e.target.value) : null
            )
          }
        />

        <select
          className="form-select mb-2"
          value={tripType}
          onChange={(e) =>
            setTripType(e.target.value as TripType)
          }
        >
          <option value="planned">Planning</option>
          <option value="visited">Already visited</option>
        </select>

        {tripType === "visited" && (
          <>
            <textarea
              className="form-control mb-2"
              placeholder="Description / tips"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <input
              type="file"
              multiple
              accept="image/*"
              className="form-control mb-2"
              onChange={handleImageChange}
            />

            {images.length > 0 && (
              <div className="row g-2">
                {images.map((img, i) => (
                  <div key={i} className="col-4">
                    <img
                      src={URL.createObjectURL(img)}
                      className="img-fluid rounded"
                      alt="preview"
                    />
                  </div>
                ))}
              </div>
            )}

            <div
              className="text-muted"
              style={{ fontSize: 12 }}
            >
              Up to 3 images. Only the first image is saved
              as cover.
            </div>
          </>
        )}

        <div className="form-check my-2">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isPublic}
            onChange={(e) =>
              setIsPublic(e.target.checked)
            }
          />
          <label className="form-check-label">
            Public
          </label>
        </div>

        <button
          className="btn btn-primary tc-pill w-100"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;