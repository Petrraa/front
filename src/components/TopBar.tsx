import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TopBar = () => {
  const { user } = useAuth();

  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      <div>
        <div className="text-muted" style={{ fontSize: 12 }}>
          Welcome back
        </div>
        <div className="fw-semibold">{user?.name || "TravelConnect"}</div>
      </div>

      <Link to="/profile" className="btn btn-light border tc-pill">
        <i className="bi bi-person-circle me-1" />
        <span style={{ fontSize: 12 }}>Me</span>
      </Link>
    </div>
  );
};

export default TopBar;