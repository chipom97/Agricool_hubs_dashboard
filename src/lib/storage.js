// ============================================================
//  storage.js  —  shared, live-syncing storage via Supabase
// ------------------------------------------------------------
//  Everyone shares ONE board. Changes broadcast live to every
//  open screen. The whole board is kept as a single JSON row in
//  a table called "board", keyed by an id string.
//
//  >>> SETUP (one time) <<<
//  1. Make a free project at https://supabase.com
//  2. In the SQL editor, create the table:
//
//       create table board (
//         id   text primary key,
//         data jsonb
//       );
//       alter table board enable row level security;
//       create policy "anyone" on board for all using (true) with check (true);
//
//  3. In Supabase: Project Settings → API. Copy the Project URL
//     and the "anon / public" key into the two lines below.
//
//  You can REUSE the same Supabase project as your other dashboard —
//  this board has its own id ("agricool_board_v1"), so the data
//  stays separate. No new table needed if "board" already exists.
//
//  Until you paste real values, the app still runs locally using
//  the seed data — it just won't sync between people.
// ============================================================

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gymqularirlbnbmhnwey.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_5YHwYaejtAY5bawdkZI5IA_S4gKoC4K";

const isConfigured =
  !SUPABASE_URL.includes("YOUR-PROJECT") &&
  !SUPABASE_ANON_KEY.includes("YOUR-ANON");

const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const impl = {
  configured: isConfigured,

  async get(key) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("board")
        .select("data")
        .eq("id", key)
        .maybeSingle();
      if (error || !data) return null;
      return { key, value: JSON.stringify(data.data), shared: true };
    } catch (e) {
      return null;
    }
  },

  async set(key, value) {
    if (!supabase) return null;
    try {
      const parsed = JSON.parse(value);
      const { error } = await supabase
        .from("board")
        .upsert({ id: key, data: parsed });
      if (error) return null;
      return { key, value, shared: true };
    } catch (e) {
      return null;
    }
  },

  async delete(key) {
    if (!supabase) return null;
    try {
      await supabase.from("board").delete().eq("id", key);
      return { key, deleted: true, shared: true };
    } catch (e) {
      return null;
    }
  },

  // Live updates: calls cb(jsonString) whenever this key changes in the DB.
  // Returns an unsubscribe function.
  subscribe(key, cb) {
    if (!supabase) return () => {};
    try {
      const channel = supabase
        .channel("board_" + key)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "board",
            filter: `id=eq.${key}`,
          },
          (payload) => {
            if (payload.new && payload.new.data)
              cb(JSON.stringify(payload.new.data));
          },
        )
        .subscribe();
      return () => supabase.removeChannel(channel);
    } catch (e) {
      return () => {};
    }
  },
};

if (typeof window !== "undefined" && !window.storage) {
  window.storage = impl;
}

export default impl;
