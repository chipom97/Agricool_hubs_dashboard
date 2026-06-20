// ============================================================
//  Tasks.jsx  —  phases as cards (click to open the drawer).
//  Includes an owner filter and an add-phase button.
// ============================================================
import React from "react";
import { Plus, ChevronRight } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";
import { TEAM, TEAM_IDS } from "../data/team.js";

function FilterBar() {
  const { ownerFilter, setOwnerFilter } = useBoard();
  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-5">
      <span className="text-[12px] text-slate-400 mr-1">Filter:</span>
      {["all", ...TEAM_IDS].map((id) => {
        const m = TEAM[id];
        const on = ownerFilter === id;
        return (
          <button key={id} onClick={() => setOwnerFilter(id)} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium" style={on ? { background: m.color + "1f", borderColor: m.color, color: m.color } : { borderColor: "#e2e8f0", color: "#64748b" }}>
            {id !== "all" && <span className="rounded-full" style={{ width: 6, height: 6, background: m.color }} />}
            {id === "all" ? "Everyone" : m.name}
          </button>
        );
      })}
    </div>
  );
}

export default function Tasks() {
  const { board, setOpenPhaseId, openNewPhase, matchOwner, taskState } = useBoard();

  return (
    <>
      <FilterBar />
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        {board.phases.map((p) => {
          const visible = p.tasks.filter(matchOwner);
          const dc = p.tasks.filter((t) => t.done).length;
          const tc = p.tasks.length;
          const pct = tc ? Math.round((dc / tc) * 100) : 0;
          const overdue = visible.filter((t) => taskState(t) === "overdue").length;
          return (
            <button key={p.id} onClick={() => setOpenPhaseId(p.id)} className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="rounded-full shrink-0" style={{ width: 10, height: 10, background: p.accent }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-slate-800 truncate">{p.label}</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">{p.month}</div>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-2"><div className="h-full rounded-full" style={{ width: pct + "%", background: p.accent }} /></div>
              <div className="flex items-center justify-between text-[12px] text-slate-500">
                <span>{dc} of {tc} done</span>
                {overdue > 0 ? <span className="text-rose-600 font-medium">{overdue} overdue</span> : <span>{pct}%</span>}
              </div>
            </button>
          );
        })}

        <button onClick={openNewPhase} className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl p-5 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 text-[14px]">
          <Plus size={16} /> Add a phase
        </button>
      </div>
    </>
  );
}
