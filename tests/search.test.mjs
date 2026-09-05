import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./load-ts.mjs";

const types = await loadTs("../src/lib/types.ts");
const batches = (await loadTs("../src/lib/scan-batches.ts", { "./types": types.url })).module;
const queries = (await loadTs("../src/lib/overpass-query.ts", { "./types": types.url })).module;
const states = (await loadTs("../src/lib/brazilian-states.ts")).module;
const geo = (await loadTs("../src/lib/geo.server.ts")).module;
const csv = (await loadTs("../src/lib/csv.ts")).module;
const qualify = (await loadTs("../src/lib/lead-qualification.ts", { "./types": types.url })).module;
const rate = (await loadTs("../src/lib/rate-limit.ts")).module;

test("a padaria is not classified as DIA just because its name contains dia", () => {
  assert.equal(qualify.classifySignals({ name: "Padaria da família" }).knownBrand, false);
  assert.equal(qualify.classifySignals({ name: "Mercado DIA" }).knownBrand, true);
});
test("WhatsApp URLs and plain Instagram handles resolve to usable contact links", () => {
  assert.equal(qualify.toWhatsappNumber("https://wa.me/5511999999999"), "5511999999999");
  const [lead] = qualify.processOverpassResults(
    [
      {
        type: "node",
        id: 1,
        lat: -23,
        lon: -46,
        tags: {
          name: "Café",
          amenity: "cafe",
          instagram: "cafedacidade",
          whatsapp: "https://wa.me/5511999999999",
        },
      },
    ],
    [],
  );
  assert.equal(lead.contact.instagramUrl, "https://instagram.com/cafedacidade");
  assert.equal(lead.contact.whatsappValid, true);
});
test("a business matching a secondary category is retained, invalid coordinates are rejected", () => {
  const element = {
    type: "node",
    id: 1,
    lat: -23,
    lon: -46,
    tags: { name: "Café e Padaria", amenity: "cafe", shop: "bakery" },
  };
  assert.equal(qualify.processOverpassResults([element], ["bakery"]).length, 1);
  assert.equal(qualify.processOverpassResults([{ ...element, lat: NaN }], []).length, 0);
});
test("burst limit recovers after its window", () => {
  assert.equal(rate.takeRateLimit("test", 2, 0), true);
  assert.equal(rate.takeRateLimit("test", 2, 1), true);
  assert.equal(rate.takeRateLimit("test", 2, 2), false);
  assert.equal(rate.takeRateLimit("test", 2, 60000), true);
});

test("social URLs in website tags are not classified as a business website", () => {
  const make = (website) => qualify.processOverpassResults([{
    type: "node", id: 1, lat: -8, lon: -70,
    tags: {name: "DELEITE SABORES", amenity: "cafe", website},
  }], [])[0];
  const instagram = make("https://instagram.com/deleite_saboresfj/?igshid=abc");
  assert.equal(instagram.signals.website, false);
  assert.equal(instagram.contact.instagramUrl, "https://instagram.com/deleite_saboresfj");
  assert.equal(make("https://wa.me/5511999999999").contact.whatsappValid, true);
  assert.equal(make("https://facebook.com/cafe").contact.websiteUrl, null);
  assert.equal(make("https://instagram.com.fake.test/cafe").signals.website, true);
  assert.equal(make("javascript:alert(1)").contact.websiteUrl, null);
});

test("Todas reaches all categories exactly once through bounded batches", () => {
  let page = 0;
  const seen = [];
  while (page !== null) {
    const batch = batches.scanBatch([], page);
    assert.ok(batch.categories.length <= 4);
    seen.push(...batch.categories);
    page = batch.nextPage;
  }
  assert.deepEqual(seen, Object.keys(types.module.CATEGORIES));
  assert.equal(new Set(seen).size, 44);
});
test("invalid inherited category names and pagination are rejected", () => {
  assert.deepEqual(
    batches.normalizeCategories(["constructor", "__proto__", "toString", "bar", "bar"]),
    ["bar"],
  );
  for (const page of [-1, 0.5, "0", 11, NaN]) assert.throws(() => batches.scanBatch([], page));
});
test("all 27 UFs select their own administrative boundary", () => {
  assert.equal(states.BRAZILIAN_STATES.length, 27);
  for (const state of states.BRAZILIAN_STATES) {
    assert.equal(states.findBrazilianStates(state.code)[0].code, state.code);
    assert.equal(states.findBrazilianStates(state.name)[0].code, state.code);
    const query = queries.buildStateOverpassQuery(state.code, ["bakery"]);
    assert.ok(query.includes(`"BR-${state.code}"`));
    assert.ok(query.includes("area.searchArea"));
    assert.ok(query.includes("bakery"));
    assert.ok(!query.includes("around:"));
  }
});
test("CSV formulas, delimiters and CR remain escaped while numeric coordinates remain numeric text", () => {
  for (const text of ["=1+1", "+cmd", "@SUM(A1)", "-1+2", "\t=1", "\u0000=1"])
    assert.ok(csv.escapeCsvCell(text).startsWith("\"'"));
  assert.equal(csv.escapeCsvCell('a,"b"\rc'), '"a,""b""\rc"');
  assert.equal(csv.escapeCsvCell(-23.5), '"-23.5"');
});
test("Overpass retries HTTP 200 execution errors, but accepts a genuinely empty result", async (t) => {
  let count = 0;
  t.mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response(
        JSON.stringify(
          ++count === 1
            ? { remark: "runtime error: timeout", elements: [] }
            : { elements: [{ type: "node", id: 7 }] },
        ),
      ),
  );
  assert.equal((await geo.queryOverpass("query"))[0].id, 7);
  assert.equal(count, 2);
  t.mock.restoreAll();
  t.mock.method(globalThis, "fetch", async () => new Response('{"elements":[]}'));
  assert.deepEqual(await geo.queryOverpass("empty"), []);
});
test("malformed provider response is an outage, not zero establishments", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("{}"));
  assert.equal(await geo.queryOverpass("broken"), null);
});
test("timeout remains active after headers and caller cancellation is preserved", async (t) => {
  let signal;
  t.mock.method(globalThis, "fetch", async (_url, init) => {
    signal = init.signal;
    return new Response("{}");
  });
  await geo.fetchWithTimeout("https://example.test", {}, 10);
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(signal.aborted, true);
  const controller = new AbortController();
  await geo.fetchWithTimeout("https://example.test", { signal: controller.signal }, 1000);
  controller.abort();
  assert.equal(signal.aborted, true);
});
