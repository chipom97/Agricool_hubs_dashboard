// ============================================================
//  Timeline.jsx  —  milestones on a vertical line, oldest to newest.
// ============================================================
import React from "react";
import { Plus, Pencil, CheckCircle2 } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";
import { fmtLong, daysTo } from "../lib/utils.js";

const DOT = {
  done:   { ring: "#10b981", fill: "#10b981" },
  now:    { ring: "#f59e0b", fill: "#f59e0b" },
  future: { ring: "#cbd5e1", fill: "#fff" },
};

export default function Timeline() {
  const { board, openNewMilestone, openEditMilestone } = useBoard();

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className="text-[15px] font-semibold text-slate-800">Milestones</div>
        <button onClick={openNewMilestone} className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-lg px-3 py-1.5"><Plus size={14} /> Add milestone</button>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-[11px] top-1 bottom-1 w-px bg-slate-200" />
        {board.milestones.map((m) => {
          const d = DOT[m.state] || DOT.future;
          const away = daysTo(m.date);
          return (
            <div key={m.id} className="relative mb-5 group">
              <span className="absolute -left-8 top-1 grid place-items-center rounded-full bg-white" style={{ width: 22, height: 22, border: `2px solid ${d.ring}` }}>
                <span className="rounded-full" style={{ width: 9, height: 9, background: d.fill }} />
              </span>
              <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-slate-800">{m.title}</span>
                    {m.state === "done" && <CheckCircle2 size={15} style={{ color: "#10b981" }} />}
                    {m.state === "now" && <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "#fde68a", color: "#92400e" }}>now</span>}
                  </div>
                  <div className="text-[12px] text-slate-400 mt-0.5">
                    {fmtLong(m.date)}{m.state !== "done" && away >= 0 && <span> · {away} days away</span>}
                  </div>
                  {m.desc && <div className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">{m.desc}</div>}
                </div>
                <button onClick={() => openEditMilestone(m)} className="shrink-0 p-1 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100"><Pencil size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
