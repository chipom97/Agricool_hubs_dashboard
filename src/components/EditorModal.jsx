// ============================================================
//  EditorModal.jsx  —  one modal that handles adding/editing
//  tasks, phases, milestones and meetings (events).
// ============================================================
import React from "react";
import { X, Trash2, Check } from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";
import { TEAM, TEAM_IDS, COLORS } from "../data/team.js";
import { Field } from "./ui.jsx";

export default function EditorModal() {
  const {
    editing, draft, setDraft, close,
    commitTask, removeTask, commitPhase, removePhase,
    commitMilestone, removeMilestone, commitEvent, removeEvent,
  } = useBoard();

  if (!editing || !draft) return null;
  const mode = editing.mode;

  const titleMap = {
    task: editing.isNew ? "Add task" : "Edit task",
    phase: editing.isNew ? "Add phase" : "Edit phase",
    milestone: editing.isNew ? "Add milestone" : "Edit milestone",
    event: editing.isNew ? "Add date / meeting" : "Edit date / meeting",
  };
  const commit = { task: commitTask, phase: commitPhase, milestone: commitMilestone, event: commitEvent }[mode];
  const remove = {
    task: () => removeTask(draft.id),
    phase: () => removePhase(draft.id),
    milestone: () => removeMilestone(draft.id),
    event: () => removeEvent(draft.id),
  }[mode];
  const canSave =
    mode === "task" ? draft.title?.trim()
    : mode === "phase" ? draft.label?.trim()
    : mode === "milestone" ? draft.title?.trim()
    : draft.label?.trim();

  const toggleOwner = (id) => {
    const has = draft.owner?.includes(id);
    let owner = has ? draft.owner.filter((o) => o !== id) : [...(draft.owner || []), id];
    if (id === "all") owner = ["all"];
    else owner = owner.filter((o) => o !== "all");
    setDraft({ ...draft, owner: owner.length ? owner : ["all"] });
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-end sm:place-items-center bg-black/40 p-0 sm:p-4" onClick={close}>
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="font-semibold text-slate-800">{titleMap[mode]}</h3>
          <button onClick={close} className="p-1 rounded-md text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {mode === "task" && (
            <>
              <Field label="Task"><input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="What needs doing?" className="fi" /></Field>
              <Field label="Assigned to">
                <div className="flex flex-wrap gap-1.5">
                  {["all", ...TEAM_IDS].map((id) => {
                    const m = TEAM[id];
                    const on = draft.owner?.includes(id);
                    return (
                      <button key={id} onClick={() => toggleOwner(id)} className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium" style={on ? { background: m.color + "1f", borderColor: m.color, color: m.color } : { borderColor: "#e2e8f0", color: "#64748b" }}>
                        <span className="rounded-full" style={{ width: 6, height: 6, background: m.color }} />{m.name}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Due date"><input type="date" value={draft.due || ""} onChange={(e) => setDraft({ ...draft, due: e.target.value })} className="fi" /></Field>
              <Field label="Note (optional)"><input value={draft.note || ""} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="Extra context…" className="fi" /></Field>
              <label className="flex items-center gap-2 text-[13px] text-slate-600">
                <input type="checkbox" checked={!!draft.ext} onChange={(e) => setDraft({ ...draft, ext: e.target.checked })} /> Key deadline (flag + add to calendar export)
              </label>
            </>
          )}

          {mode === "phase" && (
            <>
              <Field label="Phase name"><input autoFocus value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="e.g. Demo Day preparation" className="fi" /></Field>
              <Field label="Label (month / stage)"><input value={draft.month || ""} onChange={(e) => setDraft({ ...draft, month: e.target.value })} placeholder="e.g. July" className="fi" /></Field>
              <Field label="Accent colour">
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setDraft({ ...draft, accent: c })} className="rounded-full" style={{ width: 24, height: 24, background: c, outline: draft.accent === c ? "2px solid #0f172a" : "none", outlineOffset: 2 }} aria-label={"colour " + c} />
                  ))}
                </div>
              </Field>
            </>
          )}

          {mode === "milestone" && (
            <>
              <Field label="Milestone"><input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Demo Day" className="fi" /></Field>
              <Field label="Date"><input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="fi" /></Field>
              <Field label="Description"><input value={draft.desc || ""} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} placeholder="Short description…" className="fi" /></Field>
              <Field label="State">
                <select value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })} className="fi">
                  <option value="done">Done</option>
                  <option value="now">In focus now</option>
                  <option value="future">Future</option>
                </select>
              </Field>
            </>
          )}

          {mode === "event" && (
            <>
              <Field label="What"><input autoFocus value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="e.g. Internal team sync" className="fi" /></Field>
              <Field label="Date"><input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="fi" /></Field>
              <Field label="End date (optional, for multi-day)"><input type="date" value={draft.endDate || ""} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} className="fi" /></Field>
              <Field label="Type">
                <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} className="fi">
                  <option value="meeting">Meeting</option>
                  <option value="milestone">Milestone</option>
                </select>
              </Field>
              <label className="flex items-center gap-2 text-[13px] text-slate-600">
                <input type="checkbox" checked={!!draft.done} onChange={(e) => setDraft({ ...draft, done: e.target.checked })} /> Already happened
              </label>
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
          {!editing.isNew ? (
            <button onClick={remove} className="inline-flex items-center gap-1.5 text-[13px] text-rose-600 hover:text-rose-700 px-3 py-2 rounded-lg hover:bg-rose-50"><Trash2 size={15} /> Delete</button>
          ) : <span />}
          <button onClick={commit} disabled={!canSave} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white px-4 py-2 rounded-lg disabled:opacity-40" style={{ background: "#4f46e5" }}><Check size={15} /> Save</button>
        </div>
      </div>
    </div>
  );
}
