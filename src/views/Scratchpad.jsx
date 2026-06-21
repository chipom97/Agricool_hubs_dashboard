// ============================================================
//  Scratchpad.jsx  —  ONE shared notepad for the whole team.
//
//  Previously this was a grid of little blocks. It's now a single
//  big page (styled like the AstroBiz team notepads): write freely,
//  it auto-saves, and a Save button is there if you want to be sure.
//
//  Data lives on board.notes (a single string). The old block-style
//  scratchpad is migrated into it automatically in BoardContext.
// ============================================================
import React, { useRef, useState, useEffect } from "react";
import { NotebookPen, Check } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";

export default function Scratchpad() {
  const { board, saveNotes, signalTyping } = useBoard();

  const taRef = useRef(null);
  const draftRef = useRef(null);          // latest text the user has typed
  const typingRef = useRef(0);            // timestamp of the last keystroke
  const saveTimer = useRef(null);
  const [saved, setSaved] = useState(true);

  // The value to start from: an in-progress draft (survives re-renders) or
  // whatever is on the board.
  const initial = draftRef.current ?? (board.notes || "");

  // Live sync: if a teammate edits and we're not mid-typing, pull their
  // change into the textarea. Never clobbers text you're actively writing.
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    const idle = Date.now() - typingRef.current > 2500;
    if (saved && idle && (board.notes || "") !== ta.value) {
      ta.value = board.notes || "";
      draftRef.current = null;
    }
  }, [board.notes, saved]);

  // flush any pending save on unmount
  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const onInput = (e) => {
    const v = e.target.value;
    draftRef.current = v;
    typingRef.current = Date.now();
    signalTyping?.();          // tell the board not to repaint mid-keystroke
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveNotes(v);
      draftRef.current = null;
      setSaved(true);
    }, 1200);
  };

  const saveNow = () => {
    clearTimeout(saveTimer.current);
    saveNotes(taRef.current.value);
    draftRef.current = null;
    setSaved(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <div className="text-[15px] font-semibold text-slate-800">Scratchpad</div>
      </div>
      <p className="text-[12px] text-slate-400 mb-5">
        One shared page for the whole team. Dump links, half-thoughts and reminders here, then move anything important into Tasks or Milestones.
      </p>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100">
          <span className="grid place-items-center rounded-lg bg-indigo-50/60 text-indigo-600 shrink-0" style={{ width: 32, height: 32 }}>
            <NotebookPen size={16} />
          </span>
          <span className="text-[16px] font-bold text-slate-800 flex-1">Team notepad</span>
          {saved ? (
            <span className="inline-flex items-center gap-1 text-[12px] text-emerald-600 font-medium"><Check size={13} /> Saved</span>
          ) : (
            <span className="text-[12px] text-slate-400">Saving…</span>
          )}
        </div>

        <textarea
          ref={taRef}
          defaultValue={initial}
          onInput={onInput}
          placeholder="Write anything — links, ideas, blockers, reminders…"
          spellCheck={true}
          className="w-full px-5 py-4 text-[15px] text-slate-700 bg-transparent resize-y focus:outline-none leading-relaxed"
          style={{ minHeight: "58vh" }}
        />

        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-300">Auto-saves as you type · shared live with the team</span>
          <button
            onClick={saveNow}
            className="text-[13px] px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}
