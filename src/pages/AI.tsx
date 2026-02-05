import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateAIPlan } from "../api/api";

type Pace = "lagano" | "normalno" | "brzo";
type Budget = "low" | "medium" | "high";
type Companion = "solo" | "partner" | "friends" | "family";
type Experience = "relax" | "culture" | "adventure" | "party";

const AI = () => {
  const navigate = useNavigate();

  const [days, setDays] = useState(5);
  const [pace, setPace] = useState<Pace>("normalno");
  const [budget, setBudget] = useState<Budget>("medium");
  const [companion, setCompanion] = useState<Companion>("partner");
  const [experience, setExperience] = useState<Experience>("culture");

  const [likesFood, setLikesFood] = useState(true);
  const [likesNature, setLikesNature] = useState(false);
  const [likesNightlife, setLikesNightlife] = useState(false);

  const [plan, setPlan] = useState<any | null>(null);
  const [chosenDestination, setChosenDestination] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ AI bira destinaciju
  const pickDestination = (): string => {
    if (experience === "adventure") return "Lisbon";
    if (likesNightlife && companion === "friends") return "Barcelona";
    if (likesNature && budget !== "low") return "Interlaken";
    if (likesFood) return "Rome";
    if (experience === "culture") return "Paris";
    if (budget === "low") return "Budapest";
    return "Paris";
  };

  const buildInterests = (): string[] => {
    const interests: string[] = [];
    if (likesFood) interests.push("hrana");
    if (likesNature) interests.push("priroda");
    if (likesNightlife) interests.push("nocni_zivot");
    if (experience === "culture") interests.push("kultura");
    return interests.length ? interests : ["kultura"];
  };

  const handleGenerate = async () => {
    setLoading(true);

    const destination = pickDestination();
    setChosenDestination(destination);

    try {
      const payload = {
        destination,
        days,
        pace,
        interests: buildInterests(),
      };

      const res = await generateAIPlan(payload);
      setPlan(res.data.plan);
    } catch (err: any) {
      console.error("AI ERROR:", err.response?.data);
      alert("AI trenutno nije dostupan. Pokušaj ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tc-screen">
      <h5 className="mb-3">AI Travel Assistant</h5>

      {!plan && (
        <div className="card tc-card p-3">
          <h6 className="fw-semibold mb-2">
            Tell us about your trip
          </h6>

          <label className="form-label">How many days?</label>
          <input
            type="range"
            min={3}
            max={10}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="form-range mb-2"
          />
          <div className="text-muted mb-2">{days} days</div>

          <label className="form-label">Pace</label>
          <select
            className="form-select mb-2"
            value={pace}
            onChange={(e) => setPace(e.target.value as Pace)}
          >
            <option value="lagano">Relaxed</option>
            <option value="normalno">Normal</option>
            <option value="brzo">Active</option>
          </select>

          <label className="form-label">Budget</label>
          <select
            className="form-select mb-2"
            value={budget}
            onChange={(e) => setBudget(e.target.value as Budget)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label className="form-label">Who are you traveling with?</label>
          <select
            className="form-select mb-2"
            value={companion}
            onChange={(e) => setCompanion(e.target.value as Companion)}
          >
            <option value="solo">Solo</option>
            <option value="partner">Partner</option>
            <option value="friends">Friends</option>
            <option value="family">Family</option>
          </select>

          <label className="form-label">What do you want most?</label>
          <select
            className="form-select mb-3"
            value={experience}
            onChange={(e) => setExperience(e.target.value as Experience)}
          >
            <option value="relax">Relax</option>
            <option value="culture">Culture</option>
            <option value="adventure">Adventure</option>
            <option value="party">Party</option>
          </select>

          <label className="form-label">Interests</label>
          <div className="mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="likesFood"
                checked={likesFood}
                onChange={(e) => setLikesFood(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="likesFood">
                Food & Dining
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="likesNature"
                checked={likesNature}
                onChange={(e) => setLikesNature(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="likesNature">
                Nature & Outdoors
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="likesNightlife"
                checked={likesNightlife}
                onChange={(e) => setLikesNightlife(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="likesNightlife">
                Nightlife
              </label>
            </div>
          </div>

          <button
            className="btn btn-primary tc-pill w-100"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "AI is thinking..." : "Let AI choose my destination"}
          </button>
        </div>
      )}

      {plan && chosenDestination && (
        <div className="card tc-card p-3">
          <h6 className="fw-semibold mb-2">AI chose destination:</h6>
          <h4 className="mb-2">{chosenDestination}</h4>

          {plan.days.map((day: any) => (
            <div key={day.day} className="mb-3">
              <strong>Day {day.day}</strong>
              <ul>
                {day.items.map((item: any, idx: number) => (
                  <li key={idx}>
                    <strong>{item.time}</strong> – {item.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button
            className="btn btn-success tc-pill w-100"
            onClick={() =>
              navigate("/trips/create", {
                state: {
                  destination: chosenDestination,
                  aiGenerated: true,
                },
              })
            }
          >
            Create trip from this AI plan
          </button>
        </div>
      )}
    </div>
  );
};

export default AI;