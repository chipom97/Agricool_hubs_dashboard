// ============================================================
//  Scratchpad.jsx  —  shared, no-structure dumping ground for
//  links and quick notes. Add blocks, edit freely, delete when
//  you've moved something into a proper Task or Milestone.
// ============================================================
import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";

function Block({ block }) {
  const { updateScratch, removeScratch } = useBoard();
  const [text, setText] = useState(block.text);
  const [saved, setSaved] = useState(true);
  const timer = useRef(null);

  // keep in sync if someone else edits this block live
  useEffect(() => { setText(block.text); }, [block.text]);

  const onChange = (v) => {
    setText(v);
    setSaved(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { updateScratch(block.id, v); setSaved(true); }, 700);
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-3 flex gap-2 items-start">
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Paste a link or jot something down…"
        className="flex-1 min-w-0 px-3 py-2 text-[14px] text-slate-700 rounded-lg bg-slate-50 border border-slate-100 resize-y focus:outline-none focus:border-indigo-400 leading-relaxed"
      />
      <div className="flex flex-col items-center gap-1 shrink-0">
        <button onClick={() => removeScratch(block.id)} className="p-1.5 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50" aria-label="Delete block"><Trash2 size={15} /></button>
        <span className="text-[10px] text-slate-300">{saved ? "saved" : "…"}</span>
      </div>
    </div>
  );
}

export default function Scratchpad() {
  const { board, addScratch } = useBoard();

  return (
    <>
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <div className="text-[15px] font-semibold text-slate-800">Scratchpad</div>
        <button onClick={addScratch} className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-lg px-3 py-1.5"><Plus size={14} /> Add block</button>
      </div>
      <p className="text-[12px] text-slate-400 mb-5">Shared with the whole team. Dump links and half-thoughts here, then reorganise into Tasks or Milestones later.</p>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {board.scratchpad.map((b) => <Block key={b.id} block={b} />)}
      </div>

      {board.scratchpad.length === 0 && (
        <button onClick={addScratch} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 text-[14px]"><Plus size={16} /> Add your first note</button>
      )}
    </>
  );
}
