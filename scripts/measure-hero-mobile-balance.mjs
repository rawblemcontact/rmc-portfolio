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
  await page.waitForTimeout(8000);
  const m = await page.evaluate(() => {
    const hero = document.getElementById("hero");
    const video = hero?.querySelector("video")?.parentElement?.parentElement?.parentElement;
    const robbie = [...document.querySelectorAll("span")].find((el) => el.textContent?.trim() === "ROBBIE");
    const btn = [...document.querySelectorAll("button")].find((el) => el.textContent?.includes("PORTFOLIO"));
    const tagline = [...document.querySelectorAll("p")].find((el) =>
      el.textContent?.includes("Writer / digital media"),
    );
    const v = video?.getBoundingClientRect();
    const ro = robbie?.getBoundingClientRect();
    const ta = tagline?.getBoundingClientRect();
    const bt = btn?.getBoundingClientRect();
    const heroRect = hero?.getBoundingClientRect();
    const grid = hero?.querySelector("[class*='grid-rows']");
    const row2 = grid?.children[1]?.getBoundingClientRect();
    const blockTop = ro?.top ?? 0;
    const blockBottom = (bt && bt.height > 0 ? bt.bottom : null) ?? ta?.bottom ?? 0;
    const zoneTop = v?.bottom ?? 0;
    const zoneBottom = row2?.bottom ?? heroRect.bottom;
    const gapAbove = blockTop - zoneTop;
    const gapBelow = zoneBottom - blockBottom;
    return {
      gapAbove: Math.round(gapAbove),
      gapBelow: Math.round(gapBelow),
      diff: Math.round(gapBelow - gapAbove),
      blockBottom: Math.round(blockBottom),
      btnBottom: bt ? Math.round(bt.bottom) : null,
    };
  });
  console.log(label, JSON.stringify(m));
  await page.close();
}
await browser.close();
