import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./load-ts.mjs";

const storage = new Map();
globalThis.window = {
  localStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  },
};
let account = "a";
let rows = [];
let pendingRead;
let deleted = [];
let failDelete = false;
let readSession = async () => ({ data: { session: { user: { id: account } } } });
globalThis.savedLeadTestClient = {
  auth: { getSession: () => readSession() },
  from: () => ({
    select: () => ({
      eq: () => ({ order: async () => (pendingRead ? pendingRead : { data: rows, error: null }) }),
    }),
    upsert: (row) => ({ select: async () => ({ data: [{ lead_id: row.lead_id }], error: null }) }),
    delete: () => ({
      eq: () => ({
        eq: async (_key, id) => {
          deleted.push(id);
          return { error: failDelete ? { code: "offline" } : null };
        },
      }),
    }),
  }),
};
const clientUrl = "data:text/javascript,export const supabase=globalThis.savedLeadTestClient";
const saved = (await loadTs("../src/lib/saved-leads.ts", { "./supabase": clientUrl })).module;
const sample = {
  id: "node-1",
  name: "Teste",
  contact: {},
  details: {},
  signals: {},
  savedAt: "2026-09-05T00:00:00.000Z",
};

test("late sync never copies the previous account leads into the new account", async () => {
  saved.setSavedLeadUser("a");
  account = "a";
  let resolve;
  pendingRead = new Promise((done) => {
    resolve = done;
  });
  const sync = saved.syncSavedLeads();
  await new Promise((done) => setImmediate(done));
  saved.setSavedLeadUser("b");
  account = "b";
  resolve({ data: [{ lead_data: sample, saved_at: sample.savedAt }], error: null });
  assert.deepEqual(await sync, []);
  assert.deepEqual(saved.getSavedLeads(), []);
  assert.equal(storage.has("sinal-zero:saved-leads:v2:b"), false);
  pendingRead = null;
});
test("offline removal is retried and a stale remote row does not resurrect it", async () => {
  saved.setSavedLeadUser("a");
  account = "a";
  storage.set("sinal-zero:saved-leads:v2:a", JSON.stringify([sample]));
  failDelete = true;
  assert.equal(await saved.removeLead(sample.id), false);
  failDelete = false;
  deleted = [];
  rows = [{ lead_data: sample, saved_at: sample.savedAt }];
  assert.deepEqual(await saved.syncSavedLeads(), []);
  assert.deepEqual(deleted, [sample.id]);
  assert.deepEqual(saved.getSavedLeads(), []);
});
test("save started in account a cannot persist into account b", async () => {
  storage.clear();
  saved.setSavedLeadUser("a");
  account = "a";
  let resolve;
  readSession = () =>
    new Promise((done) => {
      resolve = done;
    });
  const operation = saved.saveLead(sample);
  saved.setSavedLeadUser("b");
  account = "b";
  resolve({ data: { session: { user: { id: "b" } } } });
  assert.equal((await operation).persisted, false);
  assert.deepEqual(saved.getSavedLeads(), []);
});

test("a confirmed cached lead deleted on another device is not uploaded again", async () => {
  storage.clear();
  account = "a";
  saved.setSavedLeadUser("a");
  readSession = async () => ({data: {session: {user: {id: account}}}});
  pendingRead = null;
  rows = [];
  assert.equal((await saved.saveLead(sample)).persisted, true);
  assert.equal(saved.getSavedLeads().length, 1);
  assert.deepEqual(await saved.syncSavedLeads(), []);
});

test("malformed local cache entries cannot crash date sorting", async () => {
  storage.clear();
  storage.set("sinal-zero:saved-leads:v2:a", JSON.stringify([{id: "bad"}, {...sample, savedAt: null}, sample]));
  assert.deepEqual(saved.getSavedLeads(), [sample]);
});
