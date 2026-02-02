import AppRoutes from "./routes/Routes";
import BottomNav from "./components/BottomNav";

const App = () => {
  return (
    <div className="tc-app">
      <AppRoutes />
      <BottomNav />
    </div>
  );
};

export default App;