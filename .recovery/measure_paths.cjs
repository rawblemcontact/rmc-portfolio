const fs = require("fs");
const svg = fs.readFileSync(".recovery/outlined-head.svg", "utf8");
const paths = [...svg.matchAll(/<path[^>]*d="([^"]+)"/g)].map((m) => m[1]);
console.log("paths", paths.length);

function bounds(d) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  const all = [...d.matchAll(/(-?[\d.]+(?:e[-+]?\d+)?)\s+(-?[\d.]+(?:e[-+]?\d+)?)/gi)].map((m) => [
    +m[1],
    +m[2],
  ]);
  for (const [a, b] of all) {
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    minX = Math.min(minX, a);
    minY = Math.min(minY, b);
    maxX = Math.max(maxX, a);
    maxY = Math.max(maxY, b);
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

const scored = paths
  .map((d, i) => ({ i, ...bounds(d), len: d.length }))
  .filter((b) => Number.isFinite(b.minX));
scored.sort((a, b) => b.w * b.h - a.w * a.h);
console.log("top by area:");
scored.slice(0, 15).forEach((b) => console.log(JSON.stringify(b)));

// Likely name glyphs: white fills roughly in card, width > 80, height 20-35
const nameish = scored.filter(
  (b) => b.w > 80 && b.h > 18 && b.h < 40 && b.minY > 5 && b.maxY < 78,
);
console.log("nameish:");
nameish.forEach((b) => console.log(JSON.stringify(b)));

const xish = scored.filter((b) => b.w > 3 && b.w < 6 && b.h > 3 && b.h < 6 && b.minY > 80);
console.log("xish:");
xish.forEach((b) => console.log(JSON.stringify(b)));
