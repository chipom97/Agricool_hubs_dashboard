// ============================================================
//  TaskRow.jsx  —  one task line (used in the phase drawer & tasks view).
// ============================================================
import React from "react";
import { CheckCircle2, Circle, Flag, CalendarDays, Pencil } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";
import { fmt, daysTo, STATE } from "../lib/utils.js";
import OwnerChip from "./OwnerChip.jsx";

export default function TaskRow({ t, phaseId }) {
  const { toggleTask, openEditTask, taskState } = useBoard();
  const st = taskState(t);
  const d = t.due ? daysTo(t.due) : null;

  return (
    <div className="group flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-slate-50" style={{ borderLeft: `3px solid ${STATE[st].bar}` }}>
      <button onClick={() => toggleTask(t.id)} className="mt-0.5 shrink-0" aria-label={t.done ? "Mark not done" : "Mark done"}>
        {t.done ? <CheckCircle2 size={18} style={{ color: "#10b981" }} /> : <Circle size={18} className="text-slate-300 hover:text-slate-400" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className={"text-sm leading-snug " + (t.done ? "line-through text-slate-400" : "text-slate-800")}>
          {t.title}
          {t.ext && !t.done && <Flag size={12} className="inline -mt-0.5 ml-1" style={{ color: "#f43f5e" }} />}
        </div>
        {t.note && <div className="text-[12px] text-slate-500 mt-0.5 italic">{t.note}</div>}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {t.owner.map((o) => <OwnerChip key={o} id={o} />)}
          {t.due && (
            <span className="inline-flex items-center gap-1 rounded-full text-xs font-medium px-2 py-0.5" style={{ background: STATE[st].chip, color: STATE[st].text }}>
              <CalendarDays size={11} /> {fmt(t.due)}
              {!t.done && d < 0 && <span className="font-semibold"> · {Math.abs(d)}d late</span>}
              {!t.done && d >= 0 && d <= 7 && <span className="font-semibold"> · {d === 0 ? "today" : d + "d"}</span>}
            </span>
          )}
        </div>
      </div>

      <button onClick={() => openEditTask(t, phaseId)} className="shrink-0 p-1 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100" aria-label="Edit task">
        <Pencil size={14} />
      </button>
    </div>
  );
}
