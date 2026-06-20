// ============================================================
//  Team.jsx  —  a card per founder: role, workload, open tasks.
// ============================================================
import React from "react";
import { useBoard } from "../state/BoardContext.jsx";
import { TEAM, TEAM_IDS } from "../data/team.js";
import { fmt, daysTo, parseDate, STATE } from "../lib/utils.js";

export default function Team() {
  const { allTasks, ownerStats, taskState } = useBoard();

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
      {TEAM_IDS.map((id) => {
        const m = TEAM[id];
        const s = ownerStats(id);
        const pct = s.total ? Math.round(((s.total - s.open) / s.total) * 100) : 0;
        const open = allTasks
          .filter((t) => !t.done && t.owner.includes(id))
          .sort((a, b) => (a.due ? parseDate(a.due) : Infinity) - (b.due ? parseDate(b.due) : Infinity));

        return (
          <div key={id} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="grid place-items-center rounded-full text-[14px] font-bold text-white shrink-0" style={{ width: 40, height: 40, background: m.color }}>{m.short}</span>
              <div className="min-w-0">
                <div className="text-[16px] font-semibold text-slate-800">{m.name}</div>
                <div className="text-[12px] text-slate-500 leading-snug">{m.role}</div>
              </div>
            </div>

            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1.5"><div className="h-full rounded-full" style={{ width: pct + "%", background: m.color }} /></div>
            <div className="flex justify-between text-[12px] text-slate-400 mb-3"><span>{s.total - s.open} of {s.total} done</span><span>{s.open} open</span></div>

            <div className="space-y-1">
              {open.length === 0
                ? <div className="text-[13px] text-slate-400">All clear.</div>
                : open.slice(0, 6).map((t) => {
                    const st = taskState(t);
                    return (
                      <div key={t.id} className="flex items-center gap-2 text-[13px] text-slate-600">
                        <span className="rounded-full shrink-0" style={{ width: 6, height: 6, background: STATE[st].bar }} />
                        <span className="flex-1 min-w-0 truncate">{t.title}</span>
                        {t.due && <span className="text-[11px] text-slate-400 shrink-0">{fmt(t.due)}</span>}
                      </div>
                    );
                  })}
              {open.length > 6 && <div className="text-[12px] text-slate-400 pt-1">+ {open.length - 6} more</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
