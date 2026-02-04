import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

const EditTrip = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tripId = Number(id);

  const [trip, setTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // basic trip fields
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  // ✅ NOVO: nove galerijske slike
  const [newImages, setNewImages] = useState<File[]>([]);

  // new activity inputs (postojeće)
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemTime, setNewItemTime] = useState("09:00");
  const [newItemType, setNewItemType] = useState("activity");

  useEffect(() => {
    (async () => {
      const res = await API.get(`/trips/${tripId}`);
      const t = res.data.trip;

      setTrip(t);
      setTitle(t.title);
      setDestination(t.destination);
      setDescription(t.description ?? "");
      setBudget(t.budget ?? null);
      setIsPublic(t.is_public);

      setLoading(false);
    })();
  }, [tripId]);

  /* ---------- SAVE TRIP (NA DNU) ---------- */
  const saveTrip = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("destination", destination);
    formData.append("description", description);
    if (budget !== null) formData.append("budget", String(budget));
    formData.append("is_public", isPublic ? "1" : "0");

    // ✅ NOVO: dodavanje novih slika
    newImages.forEach((img) => {
      if (img.size <= 2 * 1024 * 1024) {
        formData.append("images[]", img);
      }
    });

    await API.post(`/trips/${tripId}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate(`/trips/${tripId}`);
  };

  if (loading) return <div className="tc-screen">Loading…</div>;

  return (
    <div className="tc-screen">
      <h5 className="mb-3">Edit trip</h5>

      {/* BASIC INFO */}
      <div className="card tc-card p-3 mb-4">
        <input
          className="form-control mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          className="form-control mb-2"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
        />

        <textarea
          className="form-control mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <input
          type="number"
          className="form-control mb-2"
          value={budget ?? ""}
          onChange={(e) =>
            setBudget(e.target.value ? Number(e.target.value) : null)
          }
          placeholder="Budget"
        />

        {/* ✅ NOVO: upload još slika */}
        <label className="form-label">Add more photos</label>
        <input
          type="file"
          multiple
          accept="image/*"
          className="form-control mb-2"
          onChange={(e) =>
            setNewImages(Array.from(e.target.files ?? []))
          }
        />

        <div className="form-check mt-2">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label className="form-check-label">Public</label>
        </div>
      </div>

      {/* ITINERARY – OSTAVLJENO KAKO JE BILO */}
      {/* ... tvoj postojeći itinerary kod ... */}

      <button
        className="btn btn-primary tc-pill w-100"
        onClick={saveTrip}
      >
        Save trip
      </button>
    </div>
  );
};

export default EditTrip;