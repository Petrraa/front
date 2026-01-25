import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTripById } from '../api/api';
import type { TripData } from '../api/types';

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchTrip = async () => {
      try {
        const { data } = await getTripById(Number(id));
        setTrip(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load trip');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  if (loading) return <p>Loading trip...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!trip) return <p>Trip not found.</p>;

  return (
    <div className="container mt-4">
      <h2>{trip.title}</h2>
      <p>{trip.description}</p>

      <p>
        <strong>Date:</strong> {trip.date}
      </p>
      <p>
        <strong>Price:</strong> €{trip.price}
      </p>
    </div>
  );
};

export default TripDetails;
