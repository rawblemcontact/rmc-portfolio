import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: /PORTFOLIO/i }).first().click();
await page.waitForTimeout(800);
await page.locator("#menu button").filter({ hasText: "PROJECTS" }).first().click();
await page.waitForTimeout(2000);

const m = await page.evaluate(() => {
  const panel = document.querySelector('[aria-label="Section: projects"]');
  const body = document.querySelector(".featured-writing-inner-rule-body-top > .profile-card-surface");
  const card = document.querySelector("[data-carousel-card]");
  const pr = panel?.getBoundingClientRect();
  const br = body?.getBoundingClientRect();
  const cr = card?.getBoundingClientRect();
  const wrap = document.querySelector("#projects .projects-showcase-flow div:has(> .grid [data-carousel-card])");
  const wr = wrap?.getBoundingClientRect();
  const ws = wrap ? getComputedStyle(wrap) : null;
  return {
    fwBottomMargin: pr && br ? Math.round(pr.bottom - br.bottom) : null,
    fwBodyH: br ? Math.round(br.height) : null,
    cardTop: cr?.top,
    wrapTop: wr?.top,
    cardTopBorderVisible: cr && wr ? cr.top >= wr.top : null,
    wrapOverflow: ws?.overflow,
    cardBorderTop: card ? getComputedStyle(card).borderTopWidth : null,
  };
});
console.log(m);
await browser.close();
