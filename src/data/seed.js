// ============================================================
//  seed.js  —  the starting content of the board.
//
//  Built as a LOGBOOK: it captures the project history pulled
//  from the team WhatsApp group (Apr-Jun 2026) as well as the
//  live, upcoming work. Completed items are marked done: true
//  so they stay on the record without cluttering the to-do view.
//
//  To add a task, drop a new { ... } line into a phase's `tasks`.
//  Fields:
//    id    : any unique string
//    title : what needs doing
//    owner : array of team ids — ["bophelo"], ["tumisang","chipo"], ["all"]
//    due   : "YYYY-MM-DD"  (leave "" for no date)
//    note  : optional small italic note under the task
//    ext   : true = key deadline (flag + added to calendar export)
//    done  : true = already ticked off (history / completed)
//
//  NOTE: this seed only loads the FIRST time (or after a Reset).
//  After that, the live board in Supabase is the source of truth.
// ============================================================

export const SEED_PHASES = [
  {
    id: "history",
    label: "Programme history (Apr-May)",
    month: "Logbook",
    accent: "#64748b",
    tasks: [
      { id: "h-1", title: "Sprint 1: problem framing, Business Model Canvas, first pitch deck", owner: ["all"], due: "2026-04-25", done: true },
      { id: "h-2", title: "Adopt low-cost prototyping tools (Blueprint AM, Proteus, Arduino)", owner: ["tumisang"], due: "2026-04-27", done: true },
      { id: "h-3", title: "Submit Aspire Leaders seed-fund application", owner: ["bophelo"], due: "2026-04-28", done: true },
      { id: "h-4", title: "Decide pivot to modular hybrid storage (cold + ventilated dual-zone)", owner: ["all"], due: "2026-05-04", done: true, note: "Cold 2-8C zone + cool 8-15C ventilated zone" },
      { id: "h-5", title: "Sprint 2 deliverables: segmentation, market environment, competitive analysis, PESTEL, SWOT", owner: ["all"], due: "2026-05-14", done: true },
      { id: "h-6", title: "Rename concept: Climate-smart modular hybrid agricultural storage system", owner: ["all"], due: "2026-05-20", done: true },
      { id: "h-7", title: "Sprint 3 deliverables: 3D prototype model (Tripo3D) + architecture brief", owner: ["all"], due: "2026-05-22", done: true, note: "In-person sprint at UM6P Benguerir campus, Morocco" },
      { id: "h-8", title: "First-year direct costing in the business-plan workbook", owner: ["bophelo"], due: "2026-05-22", done: true },
    ],
  },
  {
    id: "dd",
    label: "Due-diligence finalisation",
    month: "June",
    accent: "#6366f1",
    tasks: [
      { id: "dd-0",  title: "Submit due-diligence form to AYCH", owner: ["all"], due: "2026-06-19", ext: true, done: true },
      { id: "dd-1",  title: "Founders' agreement — draft & circulate for signing", owner: ["chipo"], due: "2026-06-24", ext: true, note: "Flagged as pending in the DD submission" },
      { id: "dd-2",  title: "Individual CVs — compile for all three founders", owner: ["all"], due: "2026-06-24", ext: true, note: "Also flagged pending in the DD submission" },
      { id: "dd-3",  title: "Finalise Problem & Solution Clarity section", owner: ["tumisang"], due: "2026-06-26", note: "Submitted as a draft — needs polishing" },
      { id: "dd-4",  title: "Finalise Validation & Market Evidence section", owner: ["chipo"], due: "2026-06-27" },
      { id: "dd-5",  title: "Finalise Team & Governance section", owner: ["all"], due: "2026-06-27" },
      { id: "dd-6",  title: "Finalise Financial Readiness section", owner: ["tumisang"], due: "2026-06-28", note: "Pull figures from the business-plan workbook" },
      { id: "dd-7",  title: "Finalise Risk & Mitigation section", owner: ["bophelo"], due: "2026-06-28" },
      { id: "dd-8",  title: "Finalise Legal & Administrative section", owner: ["tumisang"], due: "2026-06-29" },
      { id: "dd-9",  title: "Finalise Impact & ESG section", owner: ["chipo"], due: "2026-06-29" },
      { id: "dd-10", title: "Finalise Partnerships & Communication section", owner: ["tumisang"], due: "2026-06-30" },
    ],
  },
  {
    id: "dice",
    label: "DICE & MVP (technical)",
    month: "Technical",
    accent: "#0ea5e9",
    tasks: [
      { id: "dc-1", title: "DICE technical-review meeting (Hassan Ez-zainabi)", owner: ["all"], due: "2026-06-15", ext: true, done: true },
      { id: "dc-2", title: "Address DICE action items 1 & 2 from the review", owner: ["bophelo"], due: "2026-06-23", note: "From the DICE presentation" },
      { id: "dc-3", title: "Answer DICE's critical technical questions", owner: ["bophelo", "chipo"], due: "2026-06-23" },
      { id: "dc-4", title: "Follow-up collaboration meeting with Hassan (DICE)", owner: ["all"], due: "2026-06-24", ext: true, note: "Define roadmap, priorities, responsibilities, next technical steps" },
      { id: "dc-5", title: "Confirm demonstration-MVP scope + test plan & KPIs", owner: ["bophelo", "chipo"], due: "2026-07-04" },
      { id: "dc-6", title: "Finalise bill of materials & component selection", owner: ["bophelo"], due: "2026-07-04", note: "Use supplier quotes (Tunel, SA, China) to build the BOQ" },
      { id: "dc-7", title: "Run thermal / energy-sizing simulation", owner: ["bophelo"], due: "2026-07-09" },
      { id: "dc-8", title: "Build low-cost demonstration MVP mock-up", owner: ["bophelo"], due: "2026-07-31", ext: true },
      { id: "dc-9", title: "Plan farmer validation pilot (willingness-to-pay)", owner: ["chipo"], due: "2026-08-15", note: "Possible first pilot site: Malotwane farm" },
    ],
  },
  {
    id: "demo",
    label: "Demo Day preparation",
    month: "July",
    accent: "#f59e0b",
    tasks: [
      { id: "dm-1", title: "Attend Month 5 workshop — Business Plans & Go-to-Market", owner: ["all"], due: "2026-07-07", ext: true },
      { id: "dm-2", title: "Build / finalise the investor pitch deck", owner: ["all"], due: "2026-07-08", note: "Team agreed Tumisang leads the pitch delivery" },
      { id: "dm-3", title: "Finalise business plan & go-to-market strategy", owner: ["tumisang"], due: "2026-07-08" },
      { id: "dm-4", title: "Prepare MVP demo visuals (3D model + system-flow diagram)", owner: ["bophelo"], due: "2026-07-09" },
      { id: "dm-5", title: "Attend Property & Technology-Transfer (IP) session", owner: ["all"], due: "2026-07-10", ext: true },
      { id: "dm-6", title: "Full pitch rehearsal (timed run-through)", owner: ["all"], due: "2026-07-10" },
      { id: "dm-7", title: "Demo Day — investor & client pitch + MVP demo", owner: ["all"], due: "2026-07-11", ext: true },
    ],
  },
  {
    id: "market",
    label: "Market & validation",
    month: "Ongoing",
    accent: "#ec4899",
    tasks: [
      { id: "mk-1", title: "Farmer collaboration in Malotwane — post-harvest-loss validation", owner: ["chipo"], due: "2026-06-30", note: "Farmer willing to collaborate and possibly host the first pilot" },
      { id: "mk-2", title: "Create a market-validation survey for farmers", owner: ["chipo"], due: "2026-06-30", note: "Assigned in the 9 Jun follow-up update" },
      { id: "mk-3", title: "Competitive analysis — Southern Africa cold storage / agri-logistics", owner: ["chipo"], due: "2026-06-30", note: "Ongoing — keep the comparison sheet current" },
      { id: "mk-4", title: "Confirm SAM / SOM figures from market data", owner: ["chipo"], due: "2026-06-28" },
      { id: "mk-5", title: "Business-model refinement (pricing tiers & bundles)", owner: ["tumisang"], due: "2026-07-02" },
      { id: "mk-6", title: "Refresh 3-year financial projections from the workbook", owner: ["tumisang"], due: "2026-07-02" },
      { id: "mk-7", title: "Explore logistics/transport extension (solar cold-room EVs)", owner: ["tumisang"], due: "2026-07-15", note: "Idea raised 17 Jun — bridge the logistics gap before Demo Day" },
    ],
  },
  {
    id: "partners",
    label: "Partnerships & outreach",
    month: "Ongoing",
    accent: "#14b8a6",
    tasks: [
      { id: "pt-1", title: "Send stakeholder letters: BDIH, BUAN, Ministry of Lands & Agriculture, Farmer Cooperatives", owner: ["bophelo"], due: "2026-06-25", note: "Drafts ready since 1 Jun; refined 15 Jun — now send & follow up" },
      { id: "pt-2", title: "Follow up Tunel Group (industrial cooling) on guidance & quote", owner: ["tumisang"], due: "2026-06-25", note: "tunelgroup.com — first email sent 1 Jun" },
      { id: "pt-3", title: "Email SA & China suppliers for BOM + full quotes", owner: ["tumisang"], due: "2026-06-27", note: "SA units seen ~P50k; China suppliers very responsive" },
      { id: "pt-4", title: "Arrange Malotwane pilot-site terms with the farmer", owner: ["chipo"], due: "2026-07-15" },
    ],
  },
  {
    id: "funding",
    label: "Funding & applications",
    month: "Ongoing",
    accent: "#8b5cf6",
    tasks: [
      { id: "fn-1", title: "Aspire Leaders seed fund — result received (not funded; HBS Foundry seat offered)", owner: ["bophelo"], due: "2026-06-02", done: true, note: "Free HBS Foundry seat, $250 value" },
      { id: "fn-2", title: "Opt in to the HBS Foundry seat (Aspire offer)", owner: ["bophelo"], due: "2026-06-15", done: true },
      { id: "fn-3", title: "MIT Kuo Sharper Center / BDIH Early-Stage — application submitted", owner: ["bophelo"], due: "2026-06-07", done: true },
      { id: "fn-4", title: "Fuze Botswana Challenge — pitch day (team chose to skip this round)", owner: ["all"], due: "2026-06-12", done: true },
      { id: "fn-5", title: "Submit pitch deck to Startup Lab Namibia", owner: ["tumisang"], due: "2026-06-30", ext: true, note: "startuplabafrica4@gmail.com — reopened for agripreneurship, send ASAP" },
      { id: "fn-6", title: "Explore CMU Africa incubation programme (needs a working prototype)", owner: ["all"], due: "2026-07-31" },
      { id: "fn-7", title: "Prepare One Young World application", owner: ["chipo"], due: "2026-09-30", note: "Window runs to around October" },
    ],
  },
  {
    id: "ops",
    label: "Operations & setup",
    month: "Ongoing",
    accent: "#f97316",
    tasks: [
      { id: "op-1", title: "Set up the project email (team@agricoolhubs.com)", owner: ["tumisang"], due: "2026-06-11", done: true, note: "Hosted on Hostinger" },
      { id: "op-2", title: "Register the project WhatsApp Business number", owner: ["bophelo"], due: "2026-06-15", done: true, note: "+267 73 085 011" },
      { id: "op-3", title: "Create the LinkedIn company page", owner: ["bophelo"], due: "2026-06-15", done: true, note: "linkedin.com/company/agricool-hubs" },
      { id: "op-4", title: "Build the AgriCool Hubs website (agricoolhubs.com)", owner: ["tumisang"], due: "2026-07-05", note: "In progress" },
      { id: "op-5", title: "Register the venture", owner: ["all"], due: "2026-07-04", ext: true, note: "Several funding programmes require a registered venture" },
      { id: "op-6", title: "Add the organisational-architecture section (mission/vision/values sheet)", owner: ["chipo"], due: "2026-06-27", note: "Flagged during Sprint 4" },
    ],
  },
];

export const SEED_EVENTS = [
  { id: "ev-dice",    label: "DICE technical review (Hassan)",         date: "2026-06-15", type: "meeting",   done: true },
  { id: "ev-dd",      label: "Due-diligence final deadline",          date: "2026-06-19", type: "milestone", done: true },
  { id: "ev-team1",   label: "Team meeting (Monday)",                 date: "2026-06-22", type: "meeting" },
  { id: "ev-dice2",   label: "DICE follow-up with Hassan",            date: "2026-06-24", type: "meeting" },
  { id: "ev-m5",      label: "Month 5: Business Plans & GTM workshop", date: "2026-07-07", endDate: "2026-07-10", type: "milestone" },
  { id: "ev-wellbe",  label: "Well-being for Entrepreneurs session",  date: "2026-07-09", type: "meeting" },
  { id: "ev-ip",      label: "Property & Technology-Transfer (IP) session", date: "2026-07-10", type: "meeting" },
  { id: "ev-demoday", label: "Demo Day — pitch + MVP demo",           date: "2026-07-11", type: "milestone" },
];

export const SEED_MILESTONES = [
  { id: "ms-s1",    title: "Sprint 1 complete",                date: "2026-04-25", desc: "Problem framing, Business Model Canvas, first pitch deck", state: "done" },
  { id: "ms-pivot", title: "Pivot to modular hybrid storage",  date: "2026-05-04", desc: "Cold + ventilated dual-zone; renamed climate-smart modular hybrid", state: "done" },
  { id: "ms-s2",    title: "Sprint 2 complete",                date: "2026-05-14", desc: "Segmentation, market environment, competitive analysis, PESTEL, SWOT", state: "done" },
  { id: "ms-s3",    title: "Sprint 3 complete",                date: "2026-05-22", desc: "Prototype (Tripo3D 3D model); in-person at UM6P Benguerir, Morocco", state: "done" },
  { id: "ms-s4",    title: "Sprint 4 complete",                date: "2026-06-15", desc: "Progress update, soft-skills & IP sessions", state: "done" },
  { id: "m1",       title: "DICE technical review",            date: "2026-06-15", desc: "Architecture assessed by DICE; feedback to integrate", state: "done" },
  { id: "m2",       title: "Due-diligence form submitted",     date: "2026-06-19", desc: "Submitted on time — sections were drafts, now being finalised", state: "done" },
  { id: "ms-dice2", title: "DICE follow-up with Hassan",       date: "2026-06-24", desc: "Define roadmap, priorities, responsibilities, next technical steps", state: "now" },
  { id: "m3",       title: "Due-diligence package finalised",  date: "2026-06-30", desc: "All 8 sections polished + founders' agreement + CVs added", state: "now" },
  { id: "m4",       title: "Month 5: Business Plans & GTM",     date: "2026-07-07", desc: "Final AYCH workshop week before Demo Day", state: "future" },
  { id: "m5",       title: "Demo Day",                         date: "2026-07-11", desc: "Investor & client pitch + MVP demo to AYCH Cohort 4", state: "future" },
  { id: "m6",       title: "Demonstration MVP ready",          date: "2026-07-31", desc: "Low-cost prototype proving technical feasibility", state: "future" },
  { id: "m7",       title: "Farmer validation pilot",          date: "2026-08-31", desc: "Willingness-to-pay pilot; potential first site at Malotwane farm", state: "future" },
];

// Shared standup log — newest entries appear first.
//  { id, author: <team id>, date: "YYYY-MM-DD", time: "HH:MM", text }
export const SEED_DIARY = [
  { id: "d1", author: "chipo",    date: "2026-06-20", time: "09:14", text: "Due-diligence form is in. Now reworking the draft sections — starting on the founders' agreement. Need everyone's CV details by Tuesday." },
  { id: "d2", author: "bophelo",  date: "2026-06-20", time: "08:02", text: "Going through DICE's feedback on the architecture (cooling choice + energy sizing). Next: lock the bill of materials. No blockers." },
  { id: "d3", author: "chipo",    date: "2026-06-19", time: "22:20", text: "Meeting notes: (1) DD form submitted. (2) Answer DICE's critical technical questions + action items 1 & 2. (3) Next team meeting Monday 7/8pm. (4) DICE follow-up with Hassan set for Wed 24 Jun." },
  { id: "d4", author: "tumisang", date: "2026-06-19", time: "17:40", text: "All due-diligence documents read through and finalised for submission. Will do the official form submission on the evening call." },
  { id: "d5", author: "bophelo",  date: "2026-06-17", time: "11:46", text: "Found a farmer in Malotwane open to collaborating on post-harvest-loss validation and possibly hosting our first pilot. Also floating a logistics/transport extension (solar cold-room EVs)." },
  { id: "d6", author: "bophelo",  date: "2026-06-15", time: "16:30", text: "DICE technical review done with Hassan. Two action items to work through. Project email, WhatsApp Business number and LinkedIn page are now live." },
];

// Open scratchpad — quick notes / links to reorganise later.
//  { id, text }
export const SEED_SCRATCHPAD = [
  { id: "s1", text: "Demo Day = 11 July. Pitch deck must hit: problem, traction, MVP demo, financials, the ask. Tumisang leads delivery." },
  { id: "s2", text: "Concept (current): Climate-smart modular hybrid agricultural storage system. Dual-zone: cold 2-8C + cool/ventilated 8-15C." },
  { id: "s3", text: "Keep precise in external docs: 30-50% post-harvest loss applies to FRUITS & VEGETABLES, not grains." },
  { id: "s4", text: "Pricing benchmark to validate: ~$0.20-0.50 per crate/day (from Sprint 2 notes)." },
  { id: "s5", text: "Project assets — email: team@agricoolhubs.com (Hostinger) · WhatsApp Business: +267 73 085 011 · LinkedIn: linkedin.com/company/agricool-hubs · Website agricoolhubs.com (in progress)." },
  { id: "s6", text: "3D prototype model (Tripo3D): studio.tripo3d.ai/3d-model/11567e10-64ee-4e4a-92f9-878876797c97" },
  { id: "s7", text: "Suppliers to chase: Tunel Group (tunelgroup.com, industrial cooling) · SA suppliers ~P50k/unit · China suppliers very responsive." },
  { id: "s8", text: "Stakeholder letters drafted (need sending): BDIH, BUAN, Ministry of Lands & Agriculture, Farmer Cooperatives." },
  { id: "s9", text: "Opportunities open: Startup Lab Namibia (startuplabafrica4@gmail.com) · One Young World (~Oct) · CMU Africa incubation · easygrant.io." },
  { id: "s10", text: "Farmer lead: Malotwane — willing to validate post-harvest loss + possibly host the first pilot." },
  { id: "s11", text: "SECURITY: passwords were shared in the WhatsApp group (AYCH portal + project email). Do NOT store them here — rotate them and use a password manager." },
];

// Single shared notepad — the Scratchpad is now one big page, not blocks.
// (If a board already has the old block-style scratchpad, BoardContext
//  migrates those blocks into this string automatically on load.)
export const SEED_NOTES = `Demo Day = 11 July. Pitch deck must hit: problem, traction, MVP demo, financials, the ask. Tumisang leads delivery.

Concept (current): Climate-smart modular hybrid agricultural storage system. Dual-zone: cold 2-8C + cool/ventilated 8-15C.

Keep precise in external docs: 30-50% post-harvest loss applies to FRUITS & VEGETABLES, not grains.

Pricing benchmark to validate: ~$0.20-0.50 per crate/day (from Sprint 2 notes).

Project assets — email: team@agricoolhubs.com (Hostinger) · WhatsApp Business: +267 73 085 011 · LinkedIn: linkedin.com/company/agricool-hubs · Website agricoolhubs.com (in progress).

3D prototype model (Tripo3D): studio.tripo3d.ai/3d-model/11567e10-64ee-4e4a-92f9-878876797c97

Suppliers to chase: Tunel Group (tunelgroup.com, industrial cooling) · SA suppliers ~P50k/unit · China suppliers very responsive.

Stakeholder letters drafted (need sending): BDIH, BUAN, Ministry of Lands & Agriculture, Farmer Cooperatives.

Opportunities open: Startup Lab Namibia (startuplabafrica4@gmail.com) · One Young World (~Oct) · CMU Africa incubation · easygrant.io.

Farmer lead: Malotwane — willing to validate post-harvest loss + possibly host the first pilot.

SECURITY: passwords were shared in the WhatsApp group (AYCH portal + project email). Do NOT store them here — rotate them and use a password manager.`;
