// src/pages/Register.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name,
      username,
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    try {
      await register(payload);
      setLoading(false);
      navigate("/home");
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || "Neuspješna registracija");
    }
  };

  return (
    <div className="tc-auth-bg">
      <div className="tc-auth-card">
        <div className="text-center mb-3">
          <div className="fw-semibold">TravelConnect</div>
          <div className="text-muted" style={{ fontSize: 13 }}>
            Create your account
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2 tc-pill"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="form-control mb-2 tc-pill"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="form-control mb-2 tc-pill"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="form-control mb-2 tc-pill"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            className="form-control mb-3 tc-pill"
            type="password"
            placeholder="Confirm password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />

          <button
            className="btn btn-primary w-100 tc-pill"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign up"}
          </button>
        </form>

        <div className="text-center mt-3" style={{ fontSize: 13 }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};