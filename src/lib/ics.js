// ============================================================
//  ics.js  —  builds a calendar (.ics) file you can import into
//  Google / Apple / Outlook calendars. Includes every meeting,
//  plus any task flagged as a key deadline (ext: true) that
//  isn't done yet. Adds 7-day and 1-day reminders to each.
// ============================================================

import { toICSDate, addDay } from "./utils.js";

export function exportICS(board) {
  if (!board) return;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const items = [];

  board.events.forEach((e) =>
    items.push({
      uid: e.id,
      start: e.date,
      end: e.endDate ? addDay(e.endDate) : addDay(e.date),
      title: e.label,
    })
  );

  board.phases.forEach((p) =>
    p.tasks.forEach((t) => {
      if (t.ext && !t.done) items.push({ uid: t.id, start: t.due, end: addDay(t.due), title: t.title });
    })
  );

  const L = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AgriCool Hubs//Dashboard//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:AgriCool Hubs",
  ];

  items
    .filter((i) => i.start)
    .forEach((i) => {
      L.push(
        "BEGIN:VEVENT",
        `UID:${i.uid}@agricoolhubs`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${toICSDate(i.start)}`,
        `DTEND;VALUE=DATE:${toICSDate(i.end)}`,
        `SUMMARY:AgriCool · ${i.title}`,
        "TRANSP:TRANSPARENT"
      );
      ["-P7D", "-P1D"].forEach((o) =>
        L.push("BEGIN:VALARM", `TRIGGER:${o}`, "ACTION:DISPLAY", `DESCRIPTION:Reminder: ${i.title}`, "END:VALARM")
      );
      L.push("END:VEVENT");
    });

  L.push("END:VCALENDAR");

  try {
    const blob = new Blob([L.join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agricool-calendar.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    window.alert("Couldn't download here.");
  }
}
