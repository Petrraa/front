import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

const typeEmoji = (type: string) => {
  switch (type) {
    case "food":
      return "🍽️";
    case "hotel":
      return "🏨";
    case "transport":
      return "🚗";
    default:
      return "📍";
  }
};

const EditTrip = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tripId = Number(id);

  const [trip, setTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [newImages, setNewImages] = useState<File[]>([]);

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

  const addDay = async () => {
    const nextDayIndex =
      trip?.days && trip.days.length > 0
        ? Math.max(...trip.days.map((d: any) => d.day_index)) + 1
        : 1;

    await API.post(`/trips/${tripId}/days`, {
      day_index: nextDayIndex,
    });

    const refreshed = await API.get(`/trips/${tripId}`);
    setTrip(refreshed.data.trip);
  };

  const deleteDay = async (dayId: number) => {
    await API.delete(`/days/${dayId}`);
    const refreshed = await API.get(`/trips/${tripId}`);
    setTrip(refreshed.data.trip);
  };

  const addActivity = async (dayId: number) => {
    if (!newItemTitle.trim()) return;

    const emoji = typeEmoji(newItemType);
    const titleWithEmoji = `${emoji} ${newItemTitle}`;

    await API.post(`/days/${dayId}/items`, {
      title: titleWithEmoji,
      start_time: newItemTime,
      item_type: newItemType,
    });

    setNewItemTitle("");
    setNewItemTime("09:00");
    setNewItemType("activity");

    const refreshed = await API.get(`/trips/${tripId}`);
    setTrip(refreshed.data.trip);
  };

  const deleteActivity = async (itemId: number) => {
    await API.delete(`/items/${itemId}`);
    const refreshed = await API.get(`/trips/${tripId}`);
    setTrip(refreshed.data.trip);
  };

  const saveTrip = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("destination", destination);
    formData.append("description", description);
    if (budget !== null) formData.append("budget", String(budget));
    formData.append("is_public", isPublic ? "1" : "0");

    if (coverImage) {
      formData.append("image", coverImage);
    }

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

        {trip.image && !coverImage && (
          <div
            className="image-preview"
            style={{
              backgroundImage: `url(http://localhost:8000/storage/${trip.image})`,
            }}
          />
        )}

        {coverImage && (
          <div
            className="image-preview"
            style={{
              backgroundImage: `url(${URL.createObjectURL(coverImage)})`,
            }}
          />
        )}

        <label className="form-label">Change cover image</label>
        <input
          type="file"
          accept="image/*"
          className="form-control mb-3"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.size > 2 * 1024 * 1024) {
              alert("Image must be smaller than 2 MB.");
              return;
            }

            setCoverImage(file);
          }}
        />

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

      <div className="itinerary-wrap">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <strong>Itinerary</strong>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={addDay}
          >
            + Add day
          </button>
        </div>

        {trip.days?.map((day: any) => (
          <div key={day.id} className="day-card">
            <div className="day-card-header">
              <strong>Day {day.day_index}</strong>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => deleteDay(day.id)}
              >
                Delete day
              </button>
            </div>

            {day.items?.map((item: any) => (
              <div key={item.id} className="activity-row">
                <div className="activity-time">{item.start_time}</div>
                <div className="activity-content">{item.title}</div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteActivity(item.id)}
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="add-activity">
              <input
                className="form-control"
                placeholder="Activity"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
              />

              <input
                type="time"
                className="form-control"
                value={newItemTime}
                onChange={(e) => setNewItemTime(e.target.value)}
              />

              <select
                className="form-control"
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value)}
              >
                <option value="activity">Activity</option>
                <option value="food">Food</option>
                <option value="hotel">Hotel</option>
                <option value="transport">Transport</option>
              </select>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addActivity(day.id)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-primary tc-pill w-100 mt-3"
        onClick={saveTrip}
      >
        Save trip
      </button>
    </div>
  );
};

export default EditTrip;