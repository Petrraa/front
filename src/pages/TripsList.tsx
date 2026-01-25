import { useEffect, useState } from 'react';
import { getTrips } from '../api/api';
import type { TripData } from '../api/types';
import { Link } from 'react-router-dom';

const TripsList = () => {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await getTrips();
        setTrips(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('Failed to load trips');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Available Trips</h2>

      {trips.length === 0 && <p>No trips found.</p>}

      <Link to="/trips/create" className="btn btn-primary mb-3">
        + New Trip
      </Link>

      <ul className="list-group">
        {trips.map((trip) => (
          <li key={trip.id} className="list-group-item">
            <p>
              <strong>Title:</strong> {trip.title}
            </p>
            <p>{trip.description}</p>
            <p>
              <strong>Date:</strong> {trip.date} | <strong>Price:</strong> €{trip.price}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripsList;
