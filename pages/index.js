import { useEffect, useState } from "react";
import SensorIndicator from "../components/SensorIndicator";
import GateIndicator from "../components/GateIndicator";
import FloodStatus from "../components/FloodStatus";

// Adjust this to wherever your Express backend is deployed.
// For local dev this matches `server.js`'s default PORT=4000.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const POLL_INTERVAL_MS = 3000;

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchStatus() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/status`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setStatus(data);
          setError(null);
          setLastFetched(new Date());
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const sensors = status?.sensors || {};
  const gates = status?.gates || {};
  const prediction = status?.prediction || {};
  const connected = status?.connection?.firebase_connected;

  return (
    <div className="min-h-screen bg-gradient-to-b from-aqua-950 via-aqua-900 to-aqua-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-10 flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            🌊 AquaGuard
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Predictive Flood Defense System — Live Dashboard
          </p>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                connected ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
            <span className="text-slate-400">
              {connected ? "Firebase Connected" : "Connecting to Firebase..."}
            </span>
            {error && (
              <span className="ml-3 text-rose-400">
                ⚠ {error} — check that the backend is running at{" "}
                {API_BASE_URL}
              </span>
            )}
          </div>
        </header>

        {/* Flood status - hero section (subscribes directly to Firebase) */}
        <section className="mb-10">
          <FloodStatus />
        </section>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Sensors */}
          <section className="rounded-3xl border border-slate-700/60 bg-slate-900/40 p-6">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Water Level Sensors
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <SensorIndicator label="WLS1" isWet={!!sensors.WLS1_Wet} />
              <SensorIndicator label="WLS2" isWet={!!sensors.WLS2_Wet} />
              <SensorIndicator label="WLS3" isWet={!!sensors.WLS3_Wet} />
              <SensorIndicator label="WLS4" isWet={!!sensors.WLS4_Wet} />
              <SensorIndicator label="WLS5" isWet={!!sensors.WLS5_Wet} />
            </div>
          </section>

          {/* Gates */}
          <section className="rounded-3xl border border-slate-700/60 bg-slate-900/40 p-6">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Servo Flood Gates
            </h2>
            <div className="flex flex-col gap-3">
              <GateIndicator label="Gate 1" isOpen={!!gates.Gate1_Open} />
              <GateIndicator label="Gate 2" isOpen={!!gates.Gate2_Open} />
              <GateIndicator label="Gate 3" isOpen={!!gates.Gate3_Open} />
            </div>
          </section>
        </div>

        {/* Prediction detail footer */}
        {prediction?.class_probabilities && (
          <section className="mt-8 rounded-3xl border border-slate-700/60 bg-slate-900/40 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Model Confidence
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries(prediction.class_probabilities).map(
                ([cls, prob]) => (
                  <div
                    key={cls}
                    className="rounded-xl bg-slate-800/50 px-3 py-2 text-center"
                  >
                    <div className="text-xs text-slate-400">{cls}</div>
                    <div className="text-lg font-bold text-slate-200">
                      {(prob * 100).toFixed(1)}%
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        <footer className="mt-10 text-center text-xs text-slate-600">
          {lastFetched && `Last refreshed ${lastFetched.toLocaleTimeString()}`}{" "}
          · Polling every {POLL_INTERVAL_MS / 1000}s
        </footer>
      </div>
    </div>
  );
}
