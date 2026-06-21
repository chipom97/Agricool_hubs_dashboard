// ============================================================
//  ui.jsx  —  tiny shared bits reused across views.
// ============================================================
import React from "react";

export function SectionLabel({ children }) {
  return (
    <h3 className="text-[13px] uppercase tracking-[0.14em] font-bold text-slate-500 mb-3">
      {children}
    </h3>
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

// Circular progress donut. Track colour comes from --ring-track (themed in
// index.css), the arc colour is passed in (usually a phase accent).
export function Ring({ pct, color, size = 72 }) {
  const r = (size - 9) / 2;
  const circ = 2 * Math.PI * r;
  const len = (pct / 100) * circ;
  const cx = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--ring-track)" strokeWidth="8" />
      <circle
        cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${len} ${circ - len}`}
        transform={`rotate(-90 ${cx} ${cx})`}
      />
      <text
        x={cx} y={cx} textAnchor="middle" dominantBaseline="central"
        fontSize={size * 0.27} fontWeight="700" fill="currentColor"
        className="text-slate-700"
      >
        {pct}%
      </text>
    </svg>
  );
}
