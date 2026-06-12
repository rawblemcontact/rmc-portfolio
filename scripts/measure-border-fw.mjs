import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });

for (const [w, h, label] of [[1024, 768, "tablet-landscape"], [1440, 900, "desktop"]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.getByRole("button", { name: /PORTFOLIO/i }).first().click();
  await page.waitForTimeout(800);
  await page.locator("#menu button").filter({ hasText: "PROJECTS" }).first().click();
  await page.waitForTimeout(2000);

  const m = await page.evaluate(() => {
    const card = document.querySelector("[data-carousel-card]");
    const wrap = document.querySelector("#projects div:has(> .grid [data-carousel-card])");
    const cr = card?.getBoundingClientRect();
    const wr = wrap?.getBoundingClientRect();
    const panel = document.querySelector('[aria-label="Section: projects"]');
    const body = document.querySelector(".featured-writing-inner-rule-body-top > .profile-card-surface");
    const pr = panel?.getBoundingClientRect();
    const br = body?.getBoundingClientRect();
    return {
      cardTopVsWrap: cr && wr ? Math.round(cr.top - wr.top) : null,
      wrapOverflowY: wrap ? getComputedStyle(wrap).overflowY : null,
      fwBottomMargin: pr && br ? Math.round(pr.bottom - br.bottom) : null,
    };
  });
  console.log(label, m);
  await page.getByRole("button", { name: /Back to menu/i }).click();
  await page.waitForTimeout(300);
}
await browser.close();
