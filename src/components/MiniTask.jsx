// ============================================================
//  MiniTask.jsx  —  compact one-line task (used on the Overview).
// ============================================================
import React from "react";
import { Circle } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";
import { TEAM } from "../data/team.js";
import { fmt, daysTo, STATE } from "../lib/utils.js";

export default function MiniTask({ t }) {
  const { toggleTask, taskState } = useBoard();
  const st = taskState(t);
  const d = t.due ? daysTo(t.due) : null;

  return (
    <button onClick={() => toggleTask(t.id)} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50">
      <Circle size={18} className="text-slate-300 shrink-0" />
      <span className="flex-1 min-w-0 text-[15px] text-slate-700 truncate">{t.title}</span>
      <span className="flex items-center gap-2 shrink-0">
        {t.owner.slice(0, 2).map((o) => (
          <span key={o} className="rounded-full" style={{ width: 9, height: 9, background: (TEAM[o] || TEAM.all).color }} />
        ))}
        {t.due && (
          <span className="inline-flex items-center gap-1 rounded-full text-[12px] font-semibold px-2.5 py-1 tabular-nums" style={{ background: STATE[st].chip, color: STATE[st].text }}>
            {fmt(t.due)}
            {!t.done && d >= 0 && d <= 7 && <span> · {d === 0 ? "today" : d + "d"}</span>}
            {!t.done && d < 0 && <span> · {Math.abs(d)}d late</span>}
          </span>
        )}
      </span>
    </button>
  );
}
