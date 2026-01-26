import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch {
      alert("Neuspješan login");
    }
  };

  return (
    <div className="tc-auth-bg">
      <div className="tc-auth-card">
        <div className="text-center mb-3">
          <div className="fw-semibold">TravelConnect</div>
          <div className="text-muted" style={{ fontSize: 13 }}>
            Sign in to continue
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2 tc-pill"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email or username"
          />
          <input
            className="form-control mb-3 tc-pill"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className="btn btn-primary w-100 tc-pill" type="submit">
            Login
          </button>
        </form>

        <div className="text-center mt-3" style={{ fontSize: 13 }}>
          No account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;