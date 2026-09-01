/**
 * CountdownTimer
 * The dashboard's centerpiece: shows the ML-predicted time remaining
 * until a critical flood breach at Sensor 5, color-coded by the
 * predicted severity class returned from the Naive Bayes model.
 */

const SEVERITY_STYLES = {
  CRITICAL: {
    ring: "border-rose-500",
    glow: "shadow-[0_0_45px_rgba(244,63,94,0.45)]",
    text: "text-rose-400",
    badge: "bg-rose-500/15 text-rose-400",
  },
  WARNING: {
    ring: "border-amber-500",
    glow: "shadow-[0_0_45px_rgba(245,158,11,0.4)]",
    text: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-400",
  },
  MODERATE: {
    ring: "border-yellow-500",
    glow: "shadow-[0_0_35px_rgba(234,179,8,0.3)]",
    text: "text-yellow-300",
    badge: "bg-yellow-500/15 text-yellow-300",
  },
  SAFE: {
    ring: "border-emerald-500",
    glow: "shadow-[0_0_35px_rgba(16,185,129,0.35)]",
    text: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-400",
  },
  DEFAULT: {
    ring: "border-slate-600",
    glow: "",
    text: "text-slate-400",
    badge: "bg-slate-600/20 text-slate-400",
  },
};

function formatSeconds(totalSeconds) {
  if (totalSeconds === null || totalSeconds === undefined) return "--:--";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CountdownTimer({ prediction }) {
  const severityClass = prediction?.predicted_class || "DEFAULT";
  const style = SEVERITY_STYLES[severityClass] || SEVERITY_STYLES.DEFAULT;
  const seconds = prediction?.estimated_seconds_remaining;

  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-700/60 bg-slate-900/60 p-8">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Estimated Time Until Critical Flood
      </span>

      <div
        className={`flex h-52 w-52 items-center justify-center rounded-full border-4 ${style.ring} ${style.glow} transition-all duration-500`}
      >
        <span className={`font-mono text-6xl font-bold ${style.text}`}>
          {formatSeconds(seconds)}
        </span>
      </div>

      <span
        className={`rounded-full px-4 py-1 text-sm font-bold uppercase tracking-wide ${style.badge}`}
      >
        {severityClass === "DEFAULT" ? "Awaiting Data" : severityClass}
      </span>

      {prediction?.last_updated && (
        <span className="text-xs text-slate-500">
          Last prediction: {new Date(prediction.last_updated).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
