import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 768, height: 1024 });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(5000);

const m = await page.evaluate(() => {
  const hero = document.getElementById("hero");
  const grid = hero?.querySelector("[class*='grid-rows']");
  const row1 = grid?.children[0];
  const video = hero?.querySelector("video")?.parentElement?.parentElement?.parentElement;
  const robbie = [...document.querySelectorAll("span")].find((el) => el.textContent?.trim() === "ROBBIE");
  const v = video?.getBoundingClientRect();
  const r1 = row1?.getBoundingClientRect();
  const ro = robbie?.getBoundingClientRect();
  const heroRect = hero?.getBoundingClientRect();
  return {
    row1: r1 ? { top: Math.round(r1.top), h: Math.round(r1.height), bottom: Math.round(r1.bottom) } : null,
    video: v ? { top: Math.round(v.top), bottom: Math.round(v.bottom), h: Math.round(v.height) } : null,
    gapVideoTopToRow1: v && r1 ? Math.round(v.top - r1.top) : null,
    gapVideoBottomToRow1: v && r1 ? Math.round(r1.bottom - v.bottom) : null,
    gapVideoToRobbie: v && ro ? Math.round(ro.top - v.bottom) : null,
    heroTop: Math.round(heroRect.top),
  };
});

console.log(JSON.stringify(m, null, 2));
await browser.close();
