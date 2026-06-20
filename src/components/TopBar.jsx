// ============================================================
//  TopBar.jsx  —  header banner with progress + Demo Day countdown.
//  On mobile it also carries the sync dot + dark-mode toggle,
//  since the desktop sidebar (which normally holds them) is hidden.
// ============================================================
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";

export default function TopBar() {
  const { counts, daysToDemo, dark, setDark, synced } = useBoard();
  const demoLabel = daysToDemo > 0 ? `${daysToDemo} days to Demo Day` : daysToDemo === 0 ? "Demo Day is today" : "Demo Day done";

  return (
    <header className="relative overflow-hidden text-white px-5 sm:px-6 py-4" style={{ background: "radial-gradient(120% 160% at 90% -20%, #15803d 0%, #105c30 50%, #0b3a20 100%)" }}>
      <div className="relative flex items-center justify-between gap-3 flex-wrap">
        <div className="text-lg sm:text-2xl font-bold tracking-tight">AgriCool Hubs — Team Dashboard</div>
        <div className="flex items-center gap-3">
          <div className="text-[12px] sm:text-[13px] font-medium text-emerald-100/90 tabular-nums">
            {counts.done} of {counts.total} done · {counts.pct}% · {demoLabel}
          </div>
          {/* mobile-only controls (desktop has them in the sidebar) */}
          <div className="flex items-center gap-2 sm:hidden">
            <span className="rounded-full" style={{ width: 7, height: 7, background: synced ? "#4ade80" : "#f87171" }} aria-label={synced ? "Live sync on" : "Sync issue"} />
            <button onClick={() => setDark((v) => !v)} className="p-1.5 rounded-md bg-white/15" aria-label="Toggle dark mode">
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </div>
      <div className="relative h-1.5 rounded-full bg-white/15 overflow-hidden mt-3">
        <div className="h-full rounded-full" style={{ width: counts.pct + "%", background: "linear-gradient(90deg,#4ade80,#fde047)" }} />
      </div>
    </header>
  );
}
