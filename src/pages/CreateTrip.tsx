import { Link, useNavigate } from "react-router-dom";
import { createTrip } from "../api/api";
import TripForm from "../components/TripForm";
import type { TripData } from "../api/types";

const CreateTrip = () => {
  const navigate = useNavigate();

  const handleCreate = async (data: TripData) => {
    await createTrip(data);
    navigate("/trips");
  };

  return (
    <div className="tc-screen">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Link to="/trips" className="btn btn-light border tc-pill">
          <i className="bi bi-chevron-left" /> Back
        </Link>
        <div className="fw-semibold">Create Trip</div>
        <div style={{ width: 72 }} />
      </div>

      <TripForm onSubmit={handleCreate} submitLabel="Create" />
    </div>
  );
};

export default CreateTrip;