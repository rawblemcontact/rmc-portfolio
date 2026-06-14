import { chromium } from "playwright";

const viewports = [
  [430, 932, "mobile-large"],
  [375, 812, "mobile-small"],
];

const browser = await chromium.launch();
for (const [w, h, label] of viewports) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: h });
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(5000);
  const m = await page.evaluate(() => {
    const hero = document.getElementById("hero");
    const grid = hero?.querySelector("[class*='grid-rows']");
    const row2 = grid?.children[1];
    const video = hero?.querySelector("video")?.closest(".overflow-hidden.rounded-\\[11px\\]") ??
      hero?.querySelector("video")?.parentElement?.parentElement?.parentElement;
    const robbie = [...document.querySelectorAll("span")].find((el) => el.textContent?.trim() === "ROBBIE");
    const btn = [...document.querySelectorAll("button")].find((el) => el.textContent?.includes("PORTFOLIO"));
    const v = video?.getBoundingClientRect();
    const r2 = row2?.getBoundingClientRect();
    const ro = robbie?.getBoundingClientRect();
    const bt = btn?.getBoundingClientRect();
    const blockTop = ro?.top ?? 0;
    const blockBottom = bt?.bottom ?? 0;
    const heroRect = hero?.getBoundingClientRect();
    const gapAbove = blockTop - (v?.bottom ?? 0);
    const gapBelow = (heroRect?.bottom ?? window.innerHeight) - blockBottom;
    return {
      gapAbove: Math.round(gapAbove),
      gapBelow: Math.round(gapBelow),
      diff: Math.round(gapBelow - gapAbove),
    };
  });
  console.log(label, JSON.stringify(m));
  await page.close();
}
await browser.close();
