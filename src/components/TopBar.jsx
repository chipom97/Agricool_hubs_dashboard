// ============================================================
//  TopBar.jsx  —  header banner with progress + Demo Day countdown.
// ============================================================
import React from "react";
import { useBoard } from "../state/BoardContext.jsx";

export default function TopBar() {
  const { counts, daysToDemo } = useBoard();
  const demoLabel = daysToDemo > 0 ? `${daysToDemo} days to Demo Day` : daysToDemo === 0 ? "Demo Day is today" : "Demo Day done";

  return (
    <header className="relative overflow-hidden text-white px-6 py-4" style={{ background: "radial-gradient(120% 160% at 90% -20%, #15803d 0%, #105c30 50%, #0b3a20 100%)" }}>
      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div className="text-2xl font-bold tracking-tight">AgriCool Hubs — Team Dashboard</div>
        <div className="text-[13px] font-medium text-emerald-100/90 tabular-nums">
          {counts.done} of {counts.total} done · {counts.pct}% · {demoLabel}
        </div>
      </div>
      <div className="relative h-1.5 rounded-full bg-white/15 overflow-hidden mt-3">
        <div className="h-full rounded-full" style={{ width: counts.pct + "%", background: "linear-gradient(90deg,#4ade80,#fde047)" }} />
      </div>
    </header>
  );
}
