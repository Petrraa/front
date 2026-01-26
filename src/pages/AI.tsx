import { useState } from "react";

const AI = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="tc-screen">
      <h5 className="mb-3">Tell us your preferences</h5>

      <div className="card tc-card p-3">
        {step === 1 && (
          <>
            <div className="fw-semibold mb-2">Dream destination?</div>
            <input className="form-control tc-pill" placeholder="e.g. Italy" />
          </>
        )}
        {step === 2 && (
          <>
            <div className="fw-semibold mb-2">Budget?</div>
            <select className="form-select tc-pill">
              <option>200€ - 500€</option>
              <option>500€ - 1000€</option>
              <option>1000€+</option>
            </select>
          </>
        )}
        {step === 3 && (
          <>
            <div className="fw-semibold mb-2">Travel style?</div>
            <select className="form-select tc-pill">
              <option>Relax</option>
              <option>Adventure</option>
              <option>Culture</option>
            </select>
          </>
        )}

        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-light tc-pill"
            disabled={step === 1}
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </button>
          <button
            className="btn btn-primary tc-pill"
            onClick={() => setStep((s) => Math.min(3, s + 1))}
          >
            {step === 3 ? "Get results" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AI;