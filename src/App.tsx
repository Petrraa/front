import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import BottomNav from "./components/BottomNav";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("lastRoute", location.pathname);
  }, [location.pathname]);

  return (
    <div className="tc-app">
      <AppRoutes />
      <BottomNav />
    </div>
  );
};

export default App;