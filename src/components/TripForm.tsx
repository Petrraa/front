import { useState } from "react";
import type { TripData } from "../api/types";

type Props = {
  initial?: Partial<TripData>;
  onSubmit: (data: TripData) => Promise<void>;
  submitLabel?: string;
};

const TripForm: React.FC<Props> = ({
  initial,
  onSubmit,
  submitLabel = "Save",
}) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [destination, setDestination] = useState(initial?.destination ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState<number>(initial?.price ?? 0);
  const [date, setDate] = useState(initial?.date ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit({
        title: title.trim(),
        destination: destination.trim(),
        description: description.trim(),
        price: Number(price),
        date,
      });
    } catch (err: any) {
      console.log("FULL ERROR:", err);
      console.log("RESPONSE DATA:", err?.response?.data);
      console.log("RESPONSE ERRORS:", err?.response?.data?.errors);

      const msg =
        err?.response?.data?.message ||
        JSON.stringify(err?.response?.data?.errors || err?.response?.data) ||
        "Failed to save trip";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card tc-card p-3">
      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          <div className="fw-semibold">Validation / Save error</div>
          <div style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{error}</div>
        </div>
      )}

      <div className="mb-2">
        <label className="form-label">Title</label>
        <input
          className="form-control tc-pill"
          placeholder="e.g. Rome weekend"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Destination</label>
        <input
          className="form-control tc-pill"
          placeholder="e.g. Rome, Italy"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          placeholder="Tell people what makes this trip special..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="row g-2 mb-2">
        <div className="col-6">
          <label className="form-label">Price (€)</label>
          <input
            type="number"
            className="form-control tc-pill"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            min={0}
          />
        </div>

        <div className="col-6">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control tc-pill"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <button className="btn btn-primary w-100 tc-pill" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default TripForm;