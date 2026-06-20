// ============================================================
//  Overview.jsx  —  the at-a-glance home screen.
// ============================================================
import React from "react";
import { Flag } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";
import { TEAM, TEAM_IDS } from "../data/team.js";
import { fmt, fmtLong, daysTo, parseDate } from "../lib/utils.js";
import MiniTask from "../components/MiniTask.jsx";

function Stat({ label, value, danger }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
      <div className="text-[13px] text-slate-500">{label}</div>
      <div className={"text-[26px] font-bold " + (danger && value > 0 ? "text-rose-600" : "text-slate-800")}>{value}</div>
    </div>
  );
}

export default function Overview() {
  const { board, allTasks, counts, buckets, ownerStats, setTab } = useBoard();

  const overdue = allTasks.filter((t) => !t.done && t.due && daysTo(t.due) < 0).length;
  const openCount = counts.total - counts.done;

  // each founder's current focus = their nearest upcoming open task
  const currentFocus = (id) => {
    const mine = allTasks
      .filter((t) => !t.done && t.owner.includes(id) && t.due)
      .sort((a, b) => parseDate(a.due) - parseDate(b.due));
    return mine[0]?.title || "—";
  };

  const nextM = board.milestones.find((m) => m.state !== "done" && daysTo(m.date) >= 0) || board.milestones.find((m) => m.state !== "done");

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Done" value={counts.done} />
        <Stat label="Open" value={openCount} />
        <Stat label="Overdue" value={overdue} danger />
        <Stat label="Due this week" value={buckets.week.length} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
        <div className="text-[13px] text-slate-500 mb-3">Where everyone's at</div>
        {TEAM_IDS.map((id, i) => {
          const m = TEAM[id];
          const s = ownerStats(id);
          return (
            <div key={id} className={"flex items-center gap-3 py-2.5 " + (i < TEAM_IDS.length - 1 ? "border-b border-slate-100" : "")}>
              <span className="grid place-items-center rounded-full text-[12px] font-bold text-white shrink-0" style={{ width: 32, height: 32, background: m.color }}>{m.short}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-slate-800">{m.name}</div>
                <div className="text-[12px] text-slate-500 truncate">Now: {currentFocus(id)}</div>
              </div>
              <div className="text-[12px] text-slate-500 shrink-0">{s.open} open</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-2">
          <div className="text-[13px] text-slate-500 px-4 pt-3 pb-1">
            {buckets.overdue.length > 0 ? "Overdue + due this week" : "Due this week"}
          </div>
          {[...buckets.overdue, ...buckets.week].length === 0
            ? <div className="text-[13px] text-slate-400 px-4 py-4">Nothing pressing. Nice.</div>
            : [...buckets.overdue, ...buckets.week].map((t) => <MiniTask key={t.id} t={t} />)}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="text-[13px] text-slate-500 mb-2">Next milestone</div>
            {nextM ? (
              <>
                <div className="text-[16px] font-semibold text-slate-800 flex items-center gap-2"><Flag size={15} style={{ color: "#f59e0b" }} /> {nextM.title}</div>
                <div className="text-[13px] text-slate-500 mt-1">{fmtLong(nextM.date)} · {Math.max(0, daysTo(nextM.date))} days away</div>
                {nextM.desc && <div className="text-[13px] text-slate-500 mt-2 leading-relaxed">{nextM.desc}</div>}
              </>
            ) : <div className="text-[13px] text-slate-400">No upcoming milestones.</div>}
          </div>

          <button onClick={() => setTab("diary")} className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:bg-slate-50">
            <div className="text-[13px] text-slate-500 mb-1">Latest standup</div>
            {board.diary[0] ? (
              <>
                <div className="text-[14px] text-slate-700 leading-relaxed line-clamp-3">{board.diary[0].text}</div>
                <div className="text-[12px] text-slate-400 mt-2">{(TEAM[board.diary[0].author] || TEAM.all).name} · {fmt(board.diary[0].date)}</div>
              </>
            ) : <div className="text-[13px] text-slate-400">No diary entries yet.</div>}
          </button>
        </div>
      </div>
    </>
  );
}
