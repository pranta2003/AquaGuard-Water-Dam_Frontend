/**
 * SensorIndicator
 * Displays a single water level sensor as a circular badge that glows
 * blue + pulses when wet, and sits dim gray when dry.
 */
export default function SensorIndicator({ label, isWet }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative flex h-16 w-16 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300
          ${
            isWet
              ? "border-sky-400 bg-sky-500/20 text-sky-300 shadow-[0_0_18px_rgba(56,189,248,0.55)] animate-pulseGlow"
              : "border-slate-700 bg-slate-800/40 text-slate-500"
          }`}
      >
        {label}
      </div>
      <span
        className={`text-xs font-medium uppercase tracking-wide ${
          isWet ? "text-sky-300" : "text-slate-500"
        }`}
      >
        {isWet ? "Wet" : "Dry"}
      </span>
    </div>
  );
}
