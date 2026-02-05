import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header>
      {user ? (
        <>
          <span>Dobrodošao, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <span>Niste prijavljeni</span>
      )}
    </header>
  );
};
