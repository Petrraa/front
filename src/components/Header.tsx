import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
      <strong className="text-primary">TravelConnect</strong>

      {user ? (
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">
            Welcome, <strong>{user.name}</strong>
          </span>
          <button
            className="btn btn-outline-danger btn-sm tc-pill"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      ) : (
        <span className="text-muted">Not logged in</span>
      )}
    </header>
  );
};