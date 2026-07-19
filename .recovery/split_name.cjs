const fs = require("fs");
const svg = fs.readFileSync(".recovery/outlined-head.svg", "utf8");
const paths = [...svg.matchAll(/<path[^>]*d="([^"]+)"[^>]*>/g)];
const namePath = paths
  .map((m) => m[1])
  .find((d) => d.length > 3000 && d.includes("12."));
if (!namePath) {
  console.log("not found", paths.map((p) => p[1].length));
  process.exit(1);
}
// Split on M commands (absolute moveto starts subpaths)
const subs = namePath.split(/(?=M)/).filter(Boolean);
console.log("subpaths", subs.length);
function bounds(d) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const m of d.matchAll(/(-?[\d.]+(?:e[-+]?\d+)?)\s+(-?[\d.]+(?:e[-+]?\d+)?)/gi)) {
    const a = +m[1],
      b = +m[2];
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    minX = Math.min(minX, a);
    minY = Math.min(minY, b);
    maxX = Math.max(maxX, a);
    maxY = Math.max(maxY, b);
  }
  return {
    minX: +minX.toFixed(2),
    minY: +minY.toFixed(2),
    maxX: +maxX.toFixed(2),
    maxY: +maxY.toFixed(2),
    w: +(maxX - minX).toFixed(2),
    h: +(maxY - minY).toFixed(2),
  };
}
const scored = subs.map((d, i) => ({ i, len: d.length, ...bounds(d) }));
scored.sort((a, b) => a.minY - b.minY || a.minX - b.minX);
// Cluster into two lines by mid Y
const line1 = scored.filter((s) => s.maxY < 42);
const line2 = scored.filter((s) => s.minY > 38);
console.log("line1 count", line1.length, "line2", line2.length);
const union = (arr) => {
  if (!arr.length) return null;
  return {
    minX: Math.min(...arr.map((a) => a.minX)),
    minY: Math.min(...arr.map((a) => a.minY)),
    maxX: Math.max(...arr.map((a) => a.maxX)),
    maxY: Math.max(...arr.map((a) => a.maxY)),
  };
};
const u1 = union(line1);
const u2 = union(line2);
console.log("ROBBIE-ish", u1, u1 && { w: +(u1.maxX - u1.minX).toFixed(2), h: +(u1.maxY - u1.minY).toFixed(2) });
console.log("MCL-ish", u2, u2 && { w: +(u2.maxX - u2.minX).toFixed(2), h: +(u2.maxY - u2.minY).toFixed(2) });
