import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import AppRoutes from './routes/Routes';

const App = () => {
  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <Link className="navbar-brand" to="/trips">TravelConnect</Link>

        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/trips">Trips</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/feed">Feed</Link>
          </li>
        </ul>
      </nav>

      <AppRoutes />
    </div>
  );
};

export default App;
