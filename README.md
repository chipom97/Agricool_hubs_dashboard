# AgriCool Hubs — Team Dashboard

A shared, live-syncing dashboard for the AgriCool Hubs founding team: tasks,
timeline, meetings, a shared standup **Diary**, and an open **Scratchpad**.
Built with React + Vite + Tailwind, with Supabase for the shared board.

Everyone sees the same board. When one person ticks a task or posts a diary
entry, it shows up live on everyone else's screen.

---

## Running it locally

You need [Node.js](https://nodejs.org) (v18+). Then, in this folder:

```bash
npm install      # one time — downloads the libraries
npm run dev      # starts a local server, prints a localhost link
```

Open the link it prints. That's it — it works straight away using the seed
data. It just won't sync between people until you connect Supabase (below).

To build the production version: `npm run build`, then `npm run preview`.

---

## Connecting Supabase (so the team shares one live board)

1. Make a free project at <https://supabase.com>.
2. In the SQL editor, paste and run:

   ```sql
   create table board (
     id   text primary key,
     data jsonb
   );
   alter table board enable row level security;
   create policy "anyone" on board for all using (true) with check (true);
   ```

3. Go to **Project Settings → API** and copy the **Project URL** and the
   **anon / public** key.
4. Paste them into the top of `src/lib/storage.js` (replacing the placeholders).

You can reuse the same Supabase project as your other dashboard — this board
has its own id (`agricool_board_v1`), so the data stays separate. No new table
needed if `board` already exists there.

> The anon/public key is safe to keep in the code — it's meant for the browser.
> Row-level security + the policy above control access.

---

## Where everything lives

```
src/
  main.jsx              start-up (don't usually touch)
  App.jsx               the shell: sidebar + which view shows
  index.css             styling + dark mode

  data/
    team.js             the 3 founders, colours, Demo Day date
    seed.js             ⭐ the tasks/milestones/meetings — edit this most

  lib/
    storage.js          Supabase connection (paste your keys here)
    utils.js            date + helper functions
    ics.js              calendar export

  state/
    BoardContext.jsx    the "brain": loads data, syncs, all the actions

  components/           reusable pieces (sidebar, task row, modal, …)
  views/                one file per tab (Overview, Tasks, Diary, …)
```

### Common edits

- **Add / change a task or deadline** → `src/data/seed.js`
  *(only loads the first time, or after a Reset — see below)*
- **Change a founder's name, role or colour** → `src/data/team.js`
- **Change how a tab looks** → the matching file in `src/views/`
- **Add a whole new tab** → add it to `NAV` in `src/components/Sidebar.jsx`,
  add a `views/` file, and add one line to the `views` map in `src/App.jsx`

### A note on seed data vs the live board

`seed.js` is only the *starting* content. Once the board is saved to Supabase,
that live version is the source of truth — editing `seed.js` afterwards won't
change what's already there. Use the **"Reset board to original plan"** link at
the bottom of the app to wipe the live board back to the seed (careful: it
resets for everyone).

If you're not connected to Supabase yet, the board lives only in memory, so a
refresh always reloads from `seed.js`.

---

## The tabs

- **Overview** — counts, who's working on what, what's due, next milestone
- **Tasks** — phases of work; click one to open its task list; filter by person
- **Timeline** — milestones from done → now → upcoming
- **Team** — each founder's role, workload, and open tasks
- **Meetings** — dates & sessions, with one-click calendar export (.ics)
- **Diary** — shared standup log; pick who you're posting as, entries group by day
- **Scratchpad** — open shared notes for links and quick thoughts to sort later
```
