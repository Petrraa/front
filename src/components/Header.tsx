import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="tc-header">
      {user ? (
        <>
          <span>Dobrodošao, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <span>Niste prijavljeni</span>
      )}
    </header>
  );
};