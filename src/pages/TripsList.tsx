import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

interface Trip {
  id: number;
  title: string;
  destination: string;
  budget: number;
  is_public: boolean;
  user_id: number;
}

const TripsList = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await API.get("/trips");

        // ✅ OVO JE KLJUČNA LINIJA
        // backend vraća objekt, ne array
        const tripsData = Array.isArray(res.data)
          ? res.data
          : res.data.data ?? res.data.trips ?? [];

        setTrips(tripsData);
      } catch (err) {
        console.error(err);
        setError("Ne mogu dohvatiti putovanja");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Moja putovanja</h4>
        <Link to="/trips/create" className="btn btn-primary">
          + Novo putovanje
        </Link>
      </div>

      {trips.length === 0 && <p>Nema putovanja</p>}

      {trips.map((trip) => (
        <Link
          key={trip.id}
          to={`/trips/${trip.id}`}
          className="card mb-2 text-decoration-none text-dark"
        >
          <div className="card-body">
            <h5 className="card-title">{trip.title}</h5>
            <p className="card-text">
              📍 {trip.destination} | 💰 {trip.budget} €
              {trip.is_public && (
                <span className="badge bg-success ms-2">Public</span>
              )}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TripsList;