// ============================================================
//  PhaseDrawer.jsx  —  slide-in panel listing one phase's tasks.
// ============================================================
import React from "react";
import { Pencil, Plus, X } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";
import TaskRow from "./TaskRow.jsx";

export default function PhaseDrawer() {
  const { board, openPhaseId, setOpenPhaseId, openEditPhase, openNewTask, matchOwner } = useBoard();
  const openPhase = board.phases.find((p) => p.id === openPhaseId);
  if (!openPhase) return null;

  const dc = openPhase.tasks.filter((t) => t.done).length;
  const tc = openPhase.tasks.length;
  const pct = tc ? Math.round((dc / tc) * 100) : 0;
  const visible = openPhase.tasks.filter(matchOwner);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpenPhaseId(null)} />
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-white z-50 flex flex-col border-l border-slate-200 shadow-2xl">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <span className="rounded-full shrink-0" style={{ width: 10, height: 10, background: openPhase.accent }} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">{openPhase.label}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">{openPhase.month}</div>
          </div>
          <button onClick={() => openEditPhase(openPhase)} className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 inline-flex items-center gap-1"><Pencil size={13} /> Edit</button>
          <button onClick={() => openNewTask(openPhase.id)} className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 inline-flex items-center gap-1"><Plus size={13} /> Task</button>
          <button onClick={() => setOpenPhaseId(null)} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="px-4 py-2.5 border-b border-slate-100">
          <div className="h-1 rounded-full bg-slate-100 overflow-hidden mb-1.5"><div className="h-full rounded-full" style={{ width: pct + "%", background: openPhase.accent }} /></div>
          <div className="flex justify-between text-[11px] text-slate-400"><span>{dc} of {tc} done</span><span>{tc ? pct + "%" : "—"}</span></div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {visible.length === 0
            ? <div className="text-xs text-slate-400 px-3 py-4">No tasks match the current filter.</div>
            : visible.map((t) => <TaskRow key={t.id} t={t} phaseId={openPhase.id} />)}
          <button onClick={() => openNewTask(openPhase.id)} className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-indigo-600 text-sm mt-1"><Plus size={15} /> Add task to this phase</button>
        </div>
      </div>
    </>
  );
}
