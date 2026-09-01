/**
 * GateIndicator
 * Displays a single servo flood gate's open/closed state as a card
 * with a colored status pill.
 */
export default function GateIndicator({ label, isOpen }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <span
        className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide
          ${
            isOpen
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-rose-500/15 text-rose-400"
          }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            isOpen ? "bg-emerald-400" : "bg-rose-400"
          }`}
        />
        {isOpen ? "Open" : "Closed"}
      </span>
    </div>
  );
}
