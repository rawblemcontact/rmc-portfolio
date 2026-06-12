import { chromium } from "playwright";

const viewports = [
  [1024, 768, "landscape"],
  [1024, 704, "landscape+chrome"],
  [768, 1024, "portrait"],
  [1180, 820, "iPad10"],
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });

for (const [w, h, label] of viewports) {
  await page.setViewportSize({ width: w, height: h });
  await page.getByRole("button", { name: /PORTFOLIO/i }).first().click();
  await page.waitForTimeout(800);
  await page.locator("#menu button").filter({ hasText: "PROJECTS" }).first().click();
  await page.waitForTimeout(2000);

  const m = await page.evaluate(() => {
    const header = document.querySelector("#projects .showcase-header");
    const card = document.querySelector("#projects [data-carousel-card]");
    const gridWrap = document.querySelector("#projects div:has(> .grid [data-carousel-card])");
    const hr = header?.getBoundingClientRect();
    const cr = card?.getBoundingClientRect();
    const styles = gridWrap ? getComputedStyle(gridWrap) : null;
    const hs = header ? getComputedStyle(header) : null;
    return {
      gapAbovePx: hr && cr ? Math.round(cr.top - hr.bottom) : null,
      cardH: cr ? Math.round(cr.height) : null,
      headerMb: hs?.marginBottom ?? null,
      wrapPt: styles?.paddingTop ?? null,
      wrapMt: styles?.marginTop ?? null,
    };
  });
  console.log(label, m);
  await page.getByRole("button", { name: /Back to menu/i }).click();
  await page.waitForTimeout(300);
}
await browser.close();
