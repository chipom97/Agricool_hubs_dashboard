// ============================================================
//  BoardContext.jsx  —  the single source of truth.
//
//  Think of this as a box the whole app can reach into. It:
//   - loads the board (from Supabase, or the seed data)
//   - keeps it in sync live across everyone's screens
//   - exposes every action (add/edit/remove task, etc.)
//   - holds shared UI state (which tab, dark mode, the editor)
//
//  Any component calls  useBoard()  to get what it needs.
// ============================================================

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import { SEED_PHASES, SEED_EVENTS, SEED_MILESTONES, SEED_DIARY, SEED_SCRATCHPAD } from "../data/seed.js";
import { DEMO_DAY } from "../data/team.js";
import { parseDate, daysTo, todayStr, newId, clone, sortTasks, taskState } from "../lib/utils.js";

const STORAGE_KEY = "agricool_board_v1";

const BoardContext = createContext(null);
export const useBoard = () => useContext(BoardContext);

const freshBoard = () => ({
  phases: clone(SEED_PHASES),
  events: clone(SEED_EVENTS),
  milestones: clone(SEED_MILESTONES),
  diary: clone(SEED_DIARY),
  scratchpad: clone(SEED_SCRATCHPAD),
});

// make sure every section exists on a loaded board
const normalise = (b) => ({
  phases: b.phases || clone(SEED_PHASES),
  events: b.events || clone(SEED_EVENTS),
  milestones: b.milestones || clone(SEED_MILESTONES),
  diary: b.diary || [],
  scratchpad: b.scratchpad || [],
});

export function BoardProvider({ children }) {
  const [board, setBoard] = useState(null);
  const [tab, setTab] = useState("overview");
  const [synced, setSynced] = useState(true);
  const [lastSynced, setLastSynced] = useState(null);
  const [openPhaseId, setOpenPhaseId] = useState(null);
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [showDone, setShowDone] = useState(true);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("agc_theme") === "dark"; } catch (e) { return false; }
  });
  // who you're posting to the diary as (remembered on this device)
  const [me, setMe] = useState(() => {
    try { return localStorage.getItem("agc_me") || "chipo"; } catch (e) { return "chipo"; }
  });

  const boardRef = useRef(board);
  boardRef.current = board;

  // ---- theme ----
  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem("agc_theme", dark ? "dark" : "light");
    } catch (e) {}
  }, [dark]);

  const pickMe = (id) => { setMe(id); try { localStorage.setItem("agc_me", id); } catch (e) {} };

  // ---- save ----
  const persist = async (next, silent) => {
    if (!silent) setBoard(next);
    try {
      if (window.storage && window.storage.configured) {
        await window.storage.set(STORAGE_KEY, JSON.stringify(next), true);
        setSynced(true);
        setLastSynced(new Date());
      }
    } catch (e) { setSynced(false); }
  };

  // ---- load + realtime ----
  useEffect(() => {
    let unsub = () => {};
    (async () => {
      let loaded = null;
      try {
        if (window.storage && window.storage.configured) {
          const r = await window.storage.get(STORAGE_KEY, true);
          if (r && r.value) loaded = normalise(JSON.parse(r.value));
        }
      } catch (e) {}
      if (!loaded) {
        loaded = freshBoard();
        persist(loaded, true);
      }
      setBoard(loaded);

      if (window.storage && window.storage.subscribe) {
        unsub = window.storage.subscribe(STORAGE_KEY, (val) => {
          try { setBoard(normalise(JSON.parse(val))); setSynced(true); setLastSynced(new Date()); } catch (e) {}
        });
      }
    })();
    return () => unsub();
    // eslint-disable-next-line
  }, []);

  // ---- poll fallback every 30s (in case realtime drops) ----
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        if (window.storage && window.storage.configured) {
          const r = await window.storage.get(STORAGE_KEY, true);
          if (r && r.value) { setBoard(normalise(JSON.parse(r.value))); setSynced(true); }
        }
      } catch (e) { setSynced(false); }
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const close = () => { setEditing(null); setDraft(null); };

  // ---- task actions ----
  const toggleTask = (id) => persist({
    ...board,
    phases: board.phases.map((p) => ({ ...p, tasks: p.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),
  });
  const openNewTask = (phaseId) => { setDraft({ id: newId(), title: "", owner: ["all"], due: todayStr(), note: "", ext: false, done: false, phaseId }); setEditing({ mode: "task", isNew: true }); };
  const openEditTask = (t, phaseId) => { setDraft({ ...t, note: t.note || "", phaseId }); setEditing({ mode: "task", isNew: false }); };
  const commitTask = () => {
    const d = draft;
    const owner = d.owner && d.owner.length ? d.owner : ["all"];
    const t = { id: d.id, title: d.title.trim(), owner, due: d.due || "", note: (d.note || "").trim(), ext: !!d.ext, done: !!d.done };
    let phases = board.phases.map((p) => ({ ...p, tasks: p.tasks.filter((x) => x.id !== t.id) }));
    phases = phases.map((p) => (p.id === d.phaseId ? { ...p, tasks: sortTasks([...p.tasks, t]) } : p));
    persist({ ...board, phases }); close();
  };
  const removeTask = (id) => { persist({ ...board, phases: board.phases.map((p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== id) })) }); close(); };

  // ---- phase actions ----
  const openNewPhase = () => { setDraft({ id: newId(), label: "", month: "", accent: "#6366f1" }); setEditing({ mode: "phase", isNew: true }); };
  const openEditPhase = (p) => { setDraft({ ...p }); setEditing({ mode: "phase", isNew: false }); };
  const commitPhase = () => {
    const d = draft;
    if (!d.label.trim()) return;
    let phases;
    if (board.phases.find((p) => p.id === d.id)) {
      phases = board.phases.map((p) => (p.id === d.id ? { ...p, label: d.label.trim(), month: d.month.trim(), accent: d.accent } : p));
    } else {
      phases = [...board.phases, { id: d.id, label: d.label.trim(), month: d.month.trim(), accent: d.accent, tasks: [] }];
    }
    persist({ ...board, phases }); close();
  };
  const removePhase = (id) => { persist({ ...board, phases: board.phases.filter((p) => p.id !== id) }); setOpenPhaseId(null); close(); };

  // ---- milestone actions ----
  const openNewMilestone = () => { setDraft({ id: newId(), title: "", date: todayStr(), desc: "", state: "future" }); setEditing({ mode: "milestone", isNew: true }); };
  const openEditMilestone = (m) => { setDraft({ ...m }); setEditing({ mode: "milestone", isNew: false }); };
  const commitMilestone = () => {
    const d = draft;
    if (!d.title.trim()) return;
    const others = board.milestones.filter((m) => m.id !== d.id);
    const m = { id: d.id, title: d.title.trim(), date: d.date, desc: (d.desc || "").trim(), state: d.state };
    const milestones = [...others, m].sort((a, b) => parseDate(a.date) - parseDate(b.date));
    persist({ ...board, milestones }); close();
  };
  const removeMilestone = (id) => { persist({ ...board, milestones: board.milestones.filter((m) => m.id !== id) }); close(); };

  // ---- event actions ----
  const openNewEvent = () => { setDraft({ id: newId(), label: "", date: todayStr(), type: "meeting", done: false }); setEditing({ mode: "event", isNew: true }); };
  const openEditEvent = (e) => { setDraft({ ...e }); setEditing({ mode: "event", isNew: false }); };
  const commitEvent = () => {
    const d = draft;
    if (!d.label.trim()) return;
    const others = board.events.filter((x) => x.id !== d.id);
    const e = { id: d.id, label: d.label.trim(), date: d.date, type: d.type, done: !!d.done, endDate: d.endDate };
    const events = [...others, e].sort((a, b) => parseDate(a.date) - parseDate(b.date));
    persist({ ...board, events }); close();
  };
  const removeEvent = (id) => { persist({ ...board, events: board.events.filter((e) => e.id !== id) }); close(); };

  // ---- diary actions ----
  const addDiary = (text) => {
    const clean = (text || "").trim();
    if (!clean) return;
    const now = new Date();
    const entry = {
      id: newId(),
      author: me,
      date: todayStr(),
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      text: clean,
    };
    persist({ ...board, diary: [entry, ...board.diary] });
  };
  const removeDiary = (id) => persist({ ...board, diary: board.diary.filter((d) => d.id !== id) });

  // ---- scratchpad actions ----
  const addScratch = () => persist({ ...board, scratchpad: [...board.scratchpad, { id: newId(), text: "" }] });
  const updateScratch = (id, text) => persist({ ...board, scratchpad: board.scratchpad.map((s) => (s.id === id ? { ...s, text } : s)) });
  const removeScratch = (id) => persist({ ...board, scratchpad: board.scratchpad.filter((s) => s.id !== id) });

  // ---- reset ----
  const resetBoard = () => {
    if (!window.confirm("Reset the whole board to the original plan? All edits and tick-offs are lost for everyone.")) return;
    persist(freshBoard());
  };

  // ---- derived values ----
  const matchOwner = (t) => ownerFilter === "all" || t.owner.includes(ownerFilter);
  const allTasks = useMemo(() => (board ? board.phases.flatMap((p) => p.tasks) : []), [board]);
  const counts = useMemo(() => {
    const total = allTasks.length, done = allTasks.filter((t) => t.done).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [allTasks]);
  const buckets = useMemo(() => {
    const open = allTasks.filter((t) => !t.done && t.due && matchOwner(t));
    const s = (a, b) => parseDate(a.due) - parseDate(b.due);
    return {
      overdue: open.filter((t) => daysTo(t.due) < 0).sort(s),
      week: open.filter((t) => daysTo(t.due) >= 0 && daysTo(t.due) <= 7).sort(s),
      soon: open.filter((t) => daysTo(t.due) >= 8 && daysTo(t.due) <= 21).sort(s),
    };
    // eslint-disable-next-line
  }, [allTasks, ownerFilter]);
  const ownerStats = (id) => {
    const l = allTasks.filter((t) => t.owner.includes(id));
    return { open: l.filter((t) => !t.done).length, total: l.length };
  };
  const daysToDemo = daysTo(DEMO_DAY);

  const value = {
    board, tab, setTab, synced, lastSynced, dark, setDark, me, pickMe,
    openPhaseId, setOpenPhaseId, ownerFilter, setOwnerFilter, showDone, setShowDone,
    editing, draft, setDraft, close,
    persist,
    toggleTask, openNewTask, openEditTask, commitTask, removeTask,
    openNewPhase, openEditPhase, commitPhase, removePhase,
    openNewMilestone, openEditMilestone, commitMilestone, removeMilestone,
    openNewEvent, openEditEvent, commitEvent, removeEvent,
    addDiary, removeDiary,
    addScratch, updateScratch, removeScratch,
    resetBoard,
    matchOwner, allTasks, counts, buckets, ownerStats, taskState, daysToDemo,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}
