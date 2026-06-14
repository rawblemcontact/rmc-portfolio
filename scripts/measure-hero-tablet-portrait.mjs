import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 768, height: 1024 });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(5000);

const m = await page.evaluate(() => {
  const hero = document.getElementById("hero");
  const video = hero?.querySelector("video")?.parentElement?.parentElement?.parentElement;
  const robbie = [...document.querySelectorAll("span")].find((el) => el.textContent?.trim() === "ROBBIE");
  const tagline = [...document.querySelectorAll("p")].find((el) =>
    el.textContent?.includes("Writer / digital media"),
  );
  const btn = [...document.querySelectorAll("button")].find((el) => el.textContent?.includes("PORTFOLIO"));
  const v = video?.getBoundingClientRect();
  const ro = robbie?.getBoundingClientRect();
  const ta = tagline?.getBoundingClientRect();
  const bt = btn?.getBoundingClientRect();
  const heroRect = hero?.getBoundingClientRect();
  const blockTop = ro?.top ?? 0;
  const blockBottom = bt?.bottom ?? ta?.bottom ?? 0;
  const gapAbove = blockTop - (v?.bottom ?? 0);
  const gapBelow = heroRect.bottom - blockBottom;
  return {
    gapAbove: Math.round(gapAbove),
    gapBelow: Math.round(gapBelow),
    diff: Math.round(gapBelow - gapAbove),
    videoBottom: Math.round(v?.bottom ?? 0),
    robbieTop: Math.round(ro?.top ?? 0),
    blockBottom: Math.round(blockBottom),
    heroBottom: Math.round(heroRect.bottom),
  };
});

console.log(JSON.stringify(m, null, 2));
await browser.close();
