/**
 * FloodStatus
 * ============
 * Subscribes LIVE (Firebase onValue, not polling) to:
 *   - /AquaGuard_Data/Predictions/Current  (predicted_class, estimated_seconds_remaining,
 *                                            show_countdown, range_seconds)
 *   - /AquaGuard_Data/Gates                (Gate1_Open, Gate2_Open, Gate3_Open)
 *
 * Rendering is branched STRICTLY on `show_countdown`:
 *   true  (WARNING/CRITICAL) -> urgent pulsing red/orange alert, live ticking
 *                                countdown, "surge detected / gates responding" copy.
 *   false (SAFE/MODERATE)    -> calm green/blue card, NO timer, NO "00:00",
 *                                NO alarm elements — just a stable status line.
 */
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../lib/firebaseClient";

const PREDICTIONS_PATH = "AquaGuard_Data/Predictions/Current";
const GATES_PATH = "AquaGuard_Data/Gates";

function formatSeconds(totalSeconds) {
  if (totalSeconds === null || totalSeconds === undefined) return "--:--";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FloodStatus() {
  const [prediction, setPrediction] = useState(null);
  const [gates, setGates] = useState(null);
  const [liveSeconds, setLiveSeconds] = useState(null);

  // Live subscription to the ML prediction.
  useEffect(() => {
    const predictionRef = ref(db, PREDICTIONS_PATH);
    const unsubscribe = onValue(predictionRef, (snapshot) => {
      const data = snapshot.val();
      setPrediction(data);
      if (data && typeof data.estimated_seconds_remaining === "number") {
        setLiveSeconds(data.estimated_seconds_remaining);
      }
    });
    return () => unsubscribe();
  }, []);

  // Live subscription to gate states (used in the alert copy / display).
  useEffect(() => {
    const gatesRef = ref(db, GATES_PATH);
    const unsubscribe = onValue(gatesRef, (snapshot) => {
      setGates(snapshot.val());
    });
    return () => unsubscribe();
  }, []);

  // Ticks estimated_seconds_remaining down to 0 locally between Firebase
  // writes so the countdown visibly animates rather than sitting static.
  // Any fresh WLS3-triggered prediction resets it via the effect above.
  useEffect(() => {
    if (!prediction?.show_countdown) return undefined;

    const interval = setInterval(() => {
      setLiveSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [prediction?.show_countdown, prediction?.last_updated]);

  // Loading state — no prediction data yet.
  if (!prediction) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-700/60 bg-slate-900/50 p-10 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-slate-300" />
        <span className="text-sm font-medium">Waiting for AquaGuard data...</span>
      </div>
    );
  }

  // ============================================================
  // show_countdown === true -> URGENT emergency UI (WARNING / CRITICAL)
  // ============================================================
  if (prediction.show_countdown === true) {
    return (
      <div
        className="relative overflow-hidden rounded-3xl border-4 border-red-600 bg-gradient-to-b from-red-950 via-red-900 to-orange-950 p-8 text-center shadow-[0_0_60px_rgba(220,38,38,0.6)]"
        role="alert"
        aria-live="assertive"
      >
        {/* Flashing alarm backdrop */}
        <div className="pointer-events-none absolute inset-0 animate-pulse bg-red-600/10" />

        <div className="relative flex flex-col items-center gap-4">
          <span className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-white animate-pulse">
            ⚠ Flood Alert — {prediction.predicted_class || "WARNING"}
          </span>

          <p className="max-w-md text-sm font-semibold text-orange-200">
            A high-speed water surge has been detected. Physical gates{" "}
            <span className="text-white">Gate 1</span> and{" "}
            <span className="text-white">Gate 2</span> are responding
            automatically.
          </p>

          <div className="flex h-56 w-56 items-center justify-center rounded-full border-8 border-red-500 bg-red-950/60 shadow-[0_0_50px_rgba(248,113,113,0.7)] animate-pulseGlow">
            <span className="font-mono text-7xl font-black text-white drop-shadow-[0_0_12px_rgba(248,113,113,0.9)]">
              {formatSeconds(liveSeconds)}
            </span>
          </div>

          <p className="text-xs font-bold uppercase tracking-wide text-red-300">
            Estimated time until overflow
          </p>

          {gates && (
            <div className="mt-2 flex gap-3 text-xs">
              <span
                className={`rounded-full px-3 py-1 font-semibold ${
                  gates.Gate1_Open
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                Gate 1: {gates.Gate1_Open ? "Open" : "Secured"}
              </span>
              <span
                className={`rounded-full px-3 py-1 font-semibold ${
                  gates.Gate2_Open
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                Gate 2: {gates.Gate2_Open ? "Open" : "Secured"}
              </span>
            </div>
          )}

          {prediction.range_seconds && (
            <p className="text-[11px] text-red-400/80">
              Model estimated range: {prediction.range_seconds[0]}s –{" "}
              {prediction.range_seconds[1]}s
            </p>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // show_countdown === false -> CALM, stable status UI (SAFE / MODERATE)
  // No timer, no "00:00", no alarm elements at all.
  // ============================================================
  return (
    <div className="rounded-3xl border border-emerald-700/50 bg-gradient-to-b from-slate-900 to-emerald-950/40 p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400">
          ✓ Status: {prediction.predicted_class || "SAFE"}
        </span>

        <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-emerald-500/50 bg-emerald-500/10">
          <span className="text-4xl">🌤️</span>
        </div>

        <p className="max-w-sm text-sm font-medium text-emerald-200">
          Water levels within normal thresholds. Flow stable.
        </p>

        {gates && (
          <div className="mt-1 flex gap-3 text-xs">
            <span className="rounded-full bg-sky-500/15 px-3 py-1 font-semibold text-sky-300">
              Gate 1: {gates.Gate1_Open ? "Open" : "Secured"}
            </span>
            <span className="rounded-full bg-sky-500/15 px-3 py-1 font-semibold text-sky-300">
              Gate 2: {gates.Gate2_Open ? "Open" : "Secured"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
