// ============================================================
//  OwnerChip.jsx  —  small coloured pill showing who owns a task.
// ============================================================
import React from "react";
import { TEAM } from "../data/team.js";

export default function OwnerChip({ id }) {
  const m = TEAM[id] || TEAM.all;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-medium"
      style={{ background: m.color + "1f", color: m.color, padding: "1px 7px", fontSize: 11 }}
    >
      <span className="rounded-full" style={{ width: 5, height: 5, background: m.color }} />
      {m.short}
    </span>
  );
}
