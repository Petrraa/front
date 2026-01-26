import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="tc-screen">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Profile</h5>
        <button className="btn btn-outline-danger btn-sm tc-pill" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="card tc-card p-3 mb-3">
        <div className="d-flex gap-2 align-items-center">
          <i className="bi bi-person-circle fs-1 text-secondary" />
          <div>
            <div className="fw-semibold">{user?.name}</div>
            <div className="text-muted">{user?.email}</div>
          </div>
        </div>
      </div>

      <div className="card tc-card p-3">
        <div className="fw-semibold mb-2">Visited</div>
        <div className="row g-2">
          {[1, 2, 3, 4].map((x) => (
            <div key={x} className="col-6">
              <div className="tc-img" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;