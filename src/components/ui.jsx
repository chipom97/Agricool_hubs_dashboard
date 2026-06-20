// ============================================================
//  ui.jsx  —  tiny shared bits reused across views.
// ============================================================
import React from "react";

export function SectionLabel({ children }) {
  return (
    <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
      {children}
    </h2>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-medium text-slate-500 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
