import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Pace = "relaxed" | "normal" | "active";
type Budget = "low" | "medium" | "high";
type Companion = "solo" | "partner" | "friends" | "family";
type Accommodation = "budget" | "comfort" | "luxury";
type TripStyle = "city" | "nature" | "mixed";

const AI = () => {
  const navigate = useNavigate();

  const [days, setDays] = useState("4-6");
  const [pace, setPace] = useState<Pace>("normal");
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<Budget>("medium");
  const [companion, setCompanion] =
    useState<Companion>("partner");
  const [avoid, setAvoid] = useState<string[]>([]);
  const [accommodation, setAccommodation] =
    useState<Accommodation>("comfort");
  const [tripStyle, setTripStyle] =
    useState<TripStyle>("mixed");

  const [result, setResult] = useState<{
    destination: string;
    reason: string;
  } | null>(null);

  const toggle = (
    value: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    setList(
      list.includes(value)
        ? list.filter((i) => i !== value)
        : [...list, value]
    );
  };

  const generate = () => {
    let destination = "Paris";
    let reason =
      "Balanced city with culture, food and attractions.";

    if (tripStyle === "nature") {
      destination = "Plitvice Lakes";
      reason =
        "Perfect for nature lovers and relaxed travel.";
    }

    if (
      interests.includes("nightlife") &&
      companion === "friends"
    ) {
      destination = "Barcelona";
      reason =
        "Great nightlife and energetic city vibe.";
    }

    if (
      interests.includes("food") &&
      accommodation !== "budget"
    ) {
      destination = "Rome";
      reason =
        "World‑class food and rich cultural heritage.";
    }

    if (
      tripStyle === "city" &&
      interests.includes("shopping")
    ) {
      destination = "Milan";
      reason =
        "Ideal destination for fashion and shopping.";
    }

    if (
      companion === "family" &&
      avoid.includes("crowds")
    ) {
      destination = "Lake Bled";
      reason =
        "Calm, family‑friendly and beautiful nature.";
    }

    setResult({ destination, reason });
  };

  return (
    <div className="tc-screen">
      <h5 className="mb-3">AI Travel Assistant</h5>

      {!result && (
        <div className="card tc-card p-3">
          {/* DAYS */}
          <label className="form-label">
            How many days?
          </label>
          <select
            className="form-select mb-2"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            <option>2-3</option>
            <option>4-6</option>
            <option>7+</option>
          </select>

          {/* PACE */}
          <label className="form-label">Pace</label>
          <select
            className="form-select mb-2"
            value={pace}
            onChange={(e) =>
              setPace(e.target.value as Pace)
            }
          >
            <option value="relaxed">Relaxed</option>
            <option value="normal">Normal</option>
            <option value="active">Active</option>
          </select>

          {/* COMPANION */}
          <label className="form-label">
            Who are you traveling with?
          </label>
          <select
            className="form-select mb-2"
            value={companion}
            onChange={(e) =>
              setCompanion(e.target.value as Companion)
            }
          >
            <option value="solo">Solo</option>
            <option value="partner">Partner</option>
            <option value="friends">Friends</option>
            <option value="family">Family</option>
          </select>

          {/* INTERESTS */}
          <label className="form-label">Interests</label>
          {[
            "food",
            "nature",
            "culture",
            "nightlife",
            "shopping",
          ].map((i) => (
            <div key={i} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={interests.includes(i)}
                onChange={() =>
                  toggle(i, interests, setInterests)
                }
              />
              <label className="form-check-label">
                {i}
              </label>
            </div>
          ))}

          {/* AVOID */}
          <label className="form-label mt-2">
            What do you want to avoid?
          </label>
          {["crowds", "heat", "walking", "prices"].map(
            (a) => (
              <div key={a} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={avoid.includes(a)}
                  onChange={() =>
                    toggle(a, avoid, setAvoid)
                  }
                />
                <label className="form-check-label">
                  {a}
                </label>
              </div>
            )
          )}

          {/* ACCOMMODATION */}
          <label className="form-label mt-2">
            Accommodation
          </label>
          <select
            className="form-select mb-2"
            value={accommodation}
            onChange={(e) =>
              setAccommodation(
                e.target.value as Accommodation
              )
            }
          >
            <option value="budget">Budget</option>
            <option value="comfort">Comfort</option>
            <option value="luxury">Luxury</option>
          </select>

          {/* STYLE */}
          <label className="form-label">
            Trip style
          </label>
          <select
            className="form-select mb-3"
            value={tripStyle}
            onChange={(e) =>
              setTripStyle(e.target.value as TripStyle)
            }
          >
            <option value="city">City break</option>
            <option value="nature">
              Nature & wellness
            </option>
            <option value="mixed">Mixed</option>
          </select>

          <button
            className="btn btn-primary tc-pill w-100"
            onClick={generate}
          >
            Generate recommendation
          </button>
        </div>
      )}

      {result && (
        <div className="card tc-card p-3">
          <h6 className="fw-semibold">
            Recommended destination
          </h6>
          <h4>{result.destination}</h4>
          <p className="text-muted">{result.reason}</p>

          <button
            className="btn btn-primary tc-pill w-100"
            onClick={() =>
              navigate("/trips/create", {
                state: {
                  destination: result.destination,
                },
              })
            }
          >
            Create trip with this recommendation
          </button>
        </div>
      )}
    </div>
  );
};

export default AI;