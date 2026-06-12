import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();

for (const [w, h, label] of [[1440, 900, "desktop"], [1024, 768, "tablet-land"], [768, 1024, "tablet-port"]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /PORTFOLIO/i }).first().click();
  await page.waitForTimeout(800);
  await page.locator("#menu button").filter({ hasText: "PROJECTS" }).first().click();
  await page.waitForTimeout(2000);

  const m = await page.evaluate(() => {
    const subhead = document.querySelector("#projects .showcase-header-subhead-rule .career-nav-section-title");
    const line = document.querySelector("#projects .showcase-main-accent-line");
    const card = document.querySelector("[data-carousel-card]");
    const sr = subhead?.getBoundingClientRect();
    const lr = line?.getBoundingClientRect();
    const cr = card?.getBoundingClientRect();
    const rule = document.querySelector("#projects .showcase-header-subhead-rule");
    return {
      subheadLineGap: sr && lr ? Math.round(lr.top - sr.bottom) : null,
      lineCardGap: lr && cr ? Math.round(cr.top - lr.bottom) : null,
      ruleGap: rule ? getComputedStyle(rule).gap : null,
      headerMb: document.querySelector("#projects .showcase-header") ? getComputedStyle(document.querySelector("#projects .showcase-header")).marginBottom : null,
    };
  });
  console.log(label, m);
}
await browser.close();
