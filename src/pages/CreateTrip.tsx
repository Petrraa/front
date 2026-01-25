import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../api/api';
import type { TripData } from '../api/types';

const CreateTrip = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const newTrip: TripData = {
        title,
        description,
        price,
        date,
      };

      await createTrip(newTrip);
      navigate('/trips');
    } catch (err) {
      console.error(err);
      setError('Failed to create trip');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Trip</h2>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          className="form-control mb-3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button className="btn btn-success">Create Trip</button>
      </form>
    </div>
  );
};

export default CreateTrip;
