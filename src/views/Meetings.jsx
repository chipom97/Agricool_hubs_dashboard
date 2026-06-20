// ============================================================
//  Meetings.jsx  —  upcoming & past dates, plus calendar export.
// ============================================================
import React from "react";
import { Plus, Pencil, CalendarPlus, CheckCircle2, Flag } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";
import { fmtLong, daysTo, parseDate } from "../lib/utils.js";
import { exportICS } from "../lib/ics.js";

export default function Meetings() {
  const { board, openNewEvent, openEditEvent } = useBoard();

  const sorted = [...board.events].sort((a, b) => parseDate(a.date) - parseDate(b.date));
  const upcoming = sorted.filter((e) => !e.done && daysTo(e.date) >= 0);
  const past = sorted.filter((e) => e.done || daysTo(e.date) < 0).reverse();

  const Row = ({ e }) => {
    const away = daysTo(e.date);
    const done = e.done || away < 0;
    return (
      <div className="group bg-white border border-slate-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
        <span className="grid place-items-center rounded-xl shrink-0" style={{ width: 40, height: 40, background: e.type === "milestone" ? "#fef3c7" : "#e0e7ff" }}>
          {e.type === "milestone" ? <Flag size={17} style={{ color: "#d97706" }} /> : <CalendarPlus size={17} style={{ color: "#4f46e5" }} />}
        </span>
        <div className="flex-1 min-w-0">
          <div className={"text-[14px] font-medium " + (done ? "text-slate-400" : "text-slate-800")}>{e.label}</div>
          <div className="text-[12px] text-slate-400">{fmtLong(e.date)}{e.endDate && <span> – {fmtLong(e.endDate)}</span>}{!done && away >= 0 && <span> · {away === 0 ? "today" : away + "d away"}</span>}</div>
        </div>
        {done && <CheckCircle2 size={16} style={{ color: "#10b981" }} className="shrink-0" />}
        <button onClick={() => openEditEvent(e)} className="shrink-0 p-1 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100"><Pencil size={14} /></button>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5 gap-2 flex-wrap">
        <div className="text-[15px] font-semibold text-slate-800">Dates & meetings</div>
        <div className="flex items-center gap-2">
          <button onClick={() => exportICS(board)} className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-lg px-3 py-1.5"><CalendarPlus size={14} /> Export to calendar</button>
          <button onClick={openNewEvent} className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-lg px-3 py-1.5"><Plus size={14} /> Add date</button>
        </div>
      </div>

      {upcoming.length > 0 && (
        <>
          <div className="text-[12px] text-slate-400 uppercase tracking-wider mb-2">Upcoming</div>
          <div className="space-y-3 mb-6">{upcoming.map((e) => <Row key={e.id} e={e} />)}</div>
        </>
      )}

      {past.length > 0 && (
        <>
          <div className="text-[12px] text-slate-400 uppercase tracking-wider mb-2">Past</div>
          <div className="space-y-3">{past.map((e) => <Row key={e.id} e={e} />)}</div>
        </>
      )}
    </>
  );
}
