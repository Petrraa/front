import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link text-center px-2 ${isActive ? "text-primary" : "text-secondary"}`;

const BottomNav = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar bg-white border-top fixed-bottom">
      <div className="container d-flex justify-content-around">
        <NavLink to="/home" className={linkClass}>
          <i className="bi bi-house fs-4" />
          <div style={{ fontSize: 12 }}>Home</div>
        </NavLink>

        <NavLink to="/trips" className={linkClass}>
          <i className="bi bi-compass fs-4" />
          <div style={{ fontSize: 12 }}>Trips</div>
        </NavLink>

        <NavLink to="/ai" className={linkClass}>
          <i className="bi bi-stars fs-4" />
          <div style={{ fontSize: 12 }}>AI</div>
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          <i className="bi bi-person fs-4" />
          <div style={{ fontSize: 12 }}>Profile</div>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;