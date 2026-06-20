// ============================================================
//  App.jsx  —  the shell. Wraps everything in the BoardProvider,
//  then lays out the sidebar, top bar, the active view, and the
//  two overlays (phase drawer + editor modal).
//
//  To add a tab: add it to NAV in components/Sidebar.jsx and add
//  a line to the `views` map below.
// ============================================================
import React from "react";
import { BoardProvider, useBoard } from "./state/BoardContext.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import PhaseDrawer from "./components/PhaseDrawer.jsx";
import EditorModal from "./components/EditorModal.jsx";

import Overview from "./views/Overview.jsx";
import Tasks from "./views/Tasks.jsx";
import Timeline from "./views/Timeline.jsx";
import Team from "./views/Team.jsx";
import Meetings from "./views/Meetings.jsx";
import Diary from "./views/Diary.jsx";
import Scratchpad from "./views/Scratchpad.jsx";

const views = {
  overview: Overview,
  tasks: Tasks,
  timeline: Timeline,
  team: Team,
  meetings: Meetings,
  diary: Diary,
  scratchpad: Scratchpad,
};

function Shell() {
  const { board, tab, resetBoard } = useBoard();

  if (!board) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-400" style={{ fontFamily: "ui-sans-serif, system-ui" }}>
        Loading your board…
      </div>
    );
  }

  const View = views[tab] || Overview;

  return (
    <div style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" }} className="min-h-screen app-root text-slate-900 flex">
      <Sidebar />

      <main className="flex-1 min-w-0">
        <TopBar />
        <div className="px-8 py-7 max-w-[1500px] mx-auto w-full">
          <View />
        </div>
        <div className="px-8 pb-8 max-w-[1500px] mx-auto w-full">
          <button onClick={resetBoard} className="text-[11px] text-slate-400 hover:text-rose-600">Reset board to original plan</button>
        </div>
      </main>

      <PhaseDrawer />
      <EditorModal />
    </div>
  );
}

export default function App() {
  return (
    <BoardProvider>
      <Shell />
    </BoardProvider>
  );
}
