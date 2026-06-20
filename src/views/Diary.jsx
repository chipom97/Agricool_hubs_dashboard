// ============================================================
//  Diary.jsx  —  shared standup log. Everyone sees everyone's
//  entries, grouped by day, newest first. Pick who you're
//  posting as (remembered on your device).
// ============================================================
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";
import { TEAM, TEAM_IDS } from "../data/team.js";
import { fmtLong, todayStr, addDay } from "../lib/utils.js";

function dayLabel(date) {
  if (date === todayStr()) return "Today";
  // yesterday = today minus one day; compare via addDay
  if (addDay(date) === todayStr()) return "Yesterday";
  return fmtLong(date);
}

export default function Diary() {
  const { board, me, pickMe, addDiary, removeDiary } = useBoard();
  const [text, setText] = useState("");

  const post = () => { addDiary(text); setText(""); };

  // group entries by date, keeping newest-first order
  const groups = [];
  board.diary.forEach((e) => {
    let g = groups.find((x) => x.date === e.date);
    if (!g) { g = { date: e.date, items: [] }; groups.push(g); }
    g.items.push(e);
  });

  const meMember = TEAM[me] || TEAM.all;

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="text-[15px] font-semibold text-slate-800">Diary</div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-slate-400">Posting as</span>
          <div className="flex gap-1">
            {TEAM_IDS.map((id) => {
              const m = TEAM[id];
              const on = me === id;
              return (
                <button key={id} onClick={() => pickMe(id)} className="rounded-full border px-2.5 py-1 text-[12px] font-medium" style={on ? { background: m.color + "1f", borderColor: m.color, color: m.color } : { borderColor: "#e2e8f0", color: "#64748b" }}>{m.name}</button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
        <div className="flex gap-3 items-start">
          <span className="grid place-items-center rounded-full text-[12px] font-bold text-white shrink-0" style={{ width: 32, height: 32, background: meMember.color }}>{meMember.short}</span>
          <div className="flex-1 min-w-0">
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="What did you do? What's next? Any blockers?" className="w-full px-3 py-2 text-[15px] text-slate-700 rounded-lg border border-slate-200 bg-slate-50 resize-y focus:outline-none focus:border-indigo-400 leading-relaxed" />
            <div className="flex justify-end mt-2">
              <button onClick={post} disabled={!text.trim()} className="text-[13px] px-4 py-2 rounded-lg text-white font-medium disabled:opacity-40" style={{ background: "#4f46e5" }}>Post update</button>
            </div>
          </div>
        </div>
      </div>

      {groups.length === 0 && <div className="text-[13px] text-slate-400">No entries yet — post the first standup above.</div>}

      {groups.map((g) => (
        <div key={g.date} className="mb-5">
          <div className="text-[12px] text-slate-400 mb-2">{dayLabel(g.date)} · {fmtLong(g.date)}</div>
          <div className="space-y-3">
            {g.items.map((e) => {
              const m = TEAM[e.author] || TEAM.all;
              return (
                <div key={e.id} className="group bg-white border border-slate-200 rounded-2xl px-5 py-4 flex gap-3">
                  <span className="grid place-items-center rounded-full text-[12px] font-bold text-white shrink-0" style={{ width: 32, height: 32, background: m.color }}>{m.short}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[14px] font-semibold text-slate-800">{m.name}</span>
                      <span className="text-[12px] text-slate-400">{e.time}</span>
                    </div>
                    <div className="text-[14px] text-slate-600 leading-relaxed mt-0.5 whitespace-pre-wrap">{e.text}</div>
                  </div>
                  <button onClick={() => removeDiary(e.id)} className="shrink-0 p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 h-fit" aria-label="Delete entry"><Trash2 size={14} /></button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
