// ============================================================
//  Overview.jsx  —  the at-a-glance home screen.
//  Styled to match the AstroBiz "Mission Control" overview:
//  colour-accented stat cards, a gradient milestone hero,
//  phase-progress donuts, and an action centre — in AgriCool green.
// ============================================================
import React from "react";
import { Flag, Bell } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";
import { TEAM, TEAM_IDS } from "../data/team.js";
import { fmt, fmtLong, daysTo, parseDate } from "../lib/utils.js";
import MiniTask from "../components/MiniTask.jsx";
import { SectionLabel, Ring } from "../components/ui.jsx";

function Stat({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5">
      <div className="text-[12px] uppercase tracking-wider text-slate-400 mb-2 font-medium">{label}</div>
      <div className="text-5xl font-bold tabular-nums leading-none" style={{ color }}>{value}</div>
    </div>
  );
}

export default function Overview() {
  const { board, allTasks, counts, buckets, ownerStats, setTab, setOpenPhaseId } = useBoard();

  const overdue = buckets.overdue.length;
  const openCount = counts.total - counts.done;

  // each founder's current focus = their nearest upcoming open task
  const currentFocus = (id) => {
    const mine = allTasks
      .filter((t) => !t.done && t.owner.includes(id) && t.due)
      .sort((a, b) => parseDate(a.due) - parseDate(b.due));
    return mine[0]?.title || "—";
  };

  const nextM =
    board.milestones.find((m) => m.state !== "done" && daysTo(m.date) >= 0) ||
    board.milestones.find((m) => m.state !== "done");

  const dCount = nextM ? daysTo(nextM.date) : 0;
  const dAway = dCount < 0 ? "overdue" : dCount === 0 ? "today" : `${dCount} days away`;

  const urgent = [...buckets.overdue, ...buckets.week];

  return (
    <>
      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Done" value={counts.done} color="#10b981" />
        <Stat label="Open" value={openCount} color="#6366f1" />
        <Stat label="Overdue" value={overdue} color="#f43f5e" />
        <Stat label="Due this week" value={buckets.week.length} color="#f59e0b" />
      </div>

      {/* milestone hero */}
      <div
        className="rounded-2xl px-7 py-6 mb-7 flex items-center gap-5 text-white"
        style={{ background: "radial-gradient(140% 220% at 100% 0%, #1d5c3f 0%, #0c2719 60%)" }}
      >
        <span className="grid place-items-center rounded-full shrink-0" style={{ width: 58, height: 58, background: "rgba(52,211,153,.18)" }}>
          <Flag size={26} style={{ color: "#6ee7b7" }} />
        </span>
        <div className="flex-1 min-w-0">
          {nextM ? (
            <>
              <div className="text-[13px] text-emerald-200/90 mb-1">Next milestone · {fmtLong(nextM.date)} · {dAway}</div>
              <div className="text-2xl font-bold leading-tight">{nextM.title}</div>
              {nextM.desc && <div className="text-sm text-emerald-100/80 mt-1">{nextM.desc}</div>}
            </>
          ) : (
            <div className="text-lg">No upcoming milestones.</div>
          )}
        </div>
        <div className="hidden sm:block text-right shrink-0">
          <div className="text-4xl font-bold tabular-nums leading-none">{counts.pct}%</div>
          <div className="text-[12px] text-emerald-200/80 mt-1">{counts.done}/{counts.total} done</div>
        </div>
      </div>

      {/* phase progress */}
      <SectionLabel>Phase progress</SectionLabel>
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(225px, 1fr))" }}>
        {board.phases.map((p) => {
          const dc = p.tasks.filter((t) => t.done).length;
          const tc = p.tasks.length;
          const pct = tc ? Math.round((dc / tc) * 100) : 0;
          return (
            <button
              key={p.id}
              onClick={() => { setTab("tasks"); setOpenPhaseId(p.id); }}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:-translate-y-0.5 transition-all p-5 flex items-center gap-4 text-left"
            >
              <Ring pct={pct} color={p.accent} size={70} />
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-slate-800 leading-tight break-words" style={{ overflowWrap: "anywhere" }}>{p.label}</div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1">{p.month}</div>
                <div className="text-[13px] text-slate-500 mt-1.5 font-medium">{dc}/{tc} tasks</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* action centre + side column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SectionLabel><Bell size={14} className="inline -mt-0.5 mr-1.5" /> {overdue > 0 ? "Action centre — overdue + due this week" : "Action centre"}</SectionLabel>
          <div className="bg-white rounded-2xl border border-slate-200 p-2">
            {urgent.length === 0
              ? <div className="text-sm text-slate-400 px-3 py-7 text-center">Nothing pressing right now 🎉</div>
              : urgent.slice(0, 8).map((t) => <MiniTask key={t.id} t={t} />)}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <SectionLabel>Where everyone's at</SectionLabel>
            <div className="bg-white rounded-2xl border border-slate-200 p-2">
              {TEAM_IDS.map((id, i) => {
                const m = TEAM[id];
                const s = ownerStats(id);
                return (
                  <div key={id} className={"flex items-center gap-3 px-3 py-2.5 " + (i < TEAM_IDS.length - 1 ? "border-b border-slate-100" : "")}>
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
          </div>

          <div>
            <SectionLabel>Latest standup</SectionLabel>
            <button onClick={() => setTab("diary")} className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-emerald-400 transition-all">
              {board.diary[0] ? (
                <>
                  <div className="text-[14px] text-slate-700 leading-relaxed line-clamp-3">{board.diary[0].text}</div>
                  <div className="text-[12px] text-slate-400 mt-2">{(TEAM[board.diary[0].author] || TEAM.all).name} · {fmt(board.diary[0].date)}</div>
                </>
              ) : <div className="text-[13px] text-slate-400">No diary entries yet.</div>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
