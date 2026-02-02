import { useState } from "react";
import type { TripData } from "../api/types";

type Props = {
  initial?: Partial<TripData>;
  onSubmit: (data: FormData) => Promise<void>;
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
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("destination", destination);
      formData.append("description", description);
      formData.append("price", String(price));
      formData.append("date", date);

      if (image) {
        formData.append("image", image);
      }

      await onSubmit(formData);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to save trip"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card tc-card p-3">
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

      <textarea
        className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="number"
        className="form-control mb-2"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        required
      />

      <input
        type="date"
        className="form-control mb-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <input
        type="file"
        className="form-control mb-3"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default TripForm;