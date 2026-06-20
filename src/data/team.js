// ============================================================
//  team.js  —  the founders + a couple of project constants.
//  Edit names, roles or colours here and they update everywhere.
// ============================================================

export const TEAM = {
  bophelo: {
    name: "Bophelo",
    short: "BM",
    role: "Founder & Technical Lead — Electrical & Electronics Engineering",
    color: "#6366f1",
  },
  tumisang: {
    name: "Tumisang",
    short: "TB",
    role: "Co-Founder & Business / IT Lead — Business Information Systems",
    color: "#10b981",
  },
  chipo: {
    name: "Chipo",
    short: "CM",
    role: "Co-Founder, Data & Research Lead — Physics",
    color: "#f59e0b",
  },
  // "all" is used when something belongs to the whole team.
  all: { name: "Whole team", short: "ALL", role: "Everyone", color: "#64748b" },
};

// The real people, in display order (excludes the "all" pseudo-member).
export const TEAM_IDS = ["bophelo", "tumisang", "chipo"];

// Palette offered when colouring phases.
export const COLORS = [
  "#6366f1", "#10b981", "#0ea5e9", "#8b5cf6", "#ec4899",
  "#f59e0b", "#14b8a6", "#ef4444", "#f97316", "#64748b",
];

// The north-star date the whole top bar counts down to.
export const DEMO_DAY = "2026-07-11";
