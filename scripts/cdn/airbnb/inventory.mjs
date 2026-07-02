import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const geom = (html) => (html.match(/ d="[^"]*"/g) || []).join("|");
const LIVE = "public/cdn/airbnb";
const DEEP = "scripts/cdn/airbnb/raw/deep";

const existing = new Set();
for (const f of readdirSync(LIVE).filter((f) => f.endsWith(".svg")))
  existing.add(geom(readFileSync(join(LIVE, f), "utf8")));

const news = new Map(); // geom -> best (shortest non-empty) label
for (const f of readdirSync(DEEP).filter((f) => f.endsWith(".json"))) {
  const d = JSON.parse(readFileSync(join(DEEP, f), "utf8"));
  for (const s of d.svgs || []) {
    const g = geom(s.html);
    if (!g || existing.has(g)) continue;
    const l = (s.label || "").trim();
    const cur = news.get(g);
    if (cur === undefined || (l && (!cur || l.length < cur.length))) news.set(g, l || cur || "");
  }
}

console.log(`NEW unique geometries: ${news.size}\n`);
let i = 0;
for (const l of news.values()) console.log(`${String(i++).padStart(3)} | ${JSON.stringify(l.slice(0, 54))}`);
