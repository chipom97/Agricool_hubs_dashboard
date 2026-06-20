// ============================================================
//  Sidebar.jsx  —  left nav rail. Add or rename tabs in NAV below.
// ============================================================
import React from "react";
import {
  LayoutDashboard, ListChecks, GitBranch, Users, CalendarDays,
  NotebookPen, StickyNote, Sun, Moon,
} from "lucide-react";
import { useBoard } from "../state/BoardContext.jsx";

export const NAV = [
  { id: "overview",   label: "Overview",   icon: LayoutDashboard },
  { id: "tasks",      label: "Tasks",      icon: ListChecks },
  { id: "timeline",   label: "Timeline",   icon: GitBranch },
  { id: "team",       label: "Team",       icon: Users },
  { id: "meetings",   label: "Meetings",   icon: CalendarDays },
  { id: "diary",      label: "Diary",      icon: NotebookPen },
  { id: "scratchpad", label: "Scratchpad", icon: StickyNote },
];

export default function Sidebar() {
  const { tab, setTab, synced, dark, setDark } = useBoard();

  return (
    <aside className="w-[150px] shrink-0 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen self-start">
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="text-[13px] font-semibold text-slate-800">AgriCool Hubs</div>
        <div className="text-[10px] text-slate-400">Team Dashboard</div>
      </div>

      <nav className="flex-1 py-2">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = tab === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={"w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors " + (active ? "text-indigo-600 font-medium bg-indigo-50/60 border-r-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50")}
            >
              <Icon size={16} />{n.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="rounded-full" style={{ width: 6, height: 6, background: synced ? "#10b981" : "#f43f5e" }} />
          {synced ? "Live sync on" : "Sync issue"}
        </div>
        <button onClick={() => setDark((v) => !v)} className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 border border-slate-200 rounded-md py-1.5">
          {dark ? <Sun size={13} /> : <Moon size={13} />}{dark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </aside>
  );
}
