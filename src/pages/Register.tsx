import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name,
      username,
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    console.log('Register payload:', payload); // DEBUG: vidi što se šalje

    try {
      await register(payload);
      setLoading(false);
      alert('Uspješno registriran!');
      navigate('/trips');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Neuspješna registracija');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={passwordConfirmation}
        onChange={e => setPasswordConfirmation(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};
