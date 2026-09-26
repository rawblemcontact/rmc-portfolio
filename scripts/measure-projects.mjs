import { chromium } from "playwright";

const viewports = [
  [1024, 704, "iPad landscape + chrome"],
  [1024, 768, "iPad landscape full"],
  [1180, 756, "iPad 10 + chrome"],
  [1180, 820, "iPad 10"],
  [1194, 834, "iPad Pro 11"],
  [768, 1024, "tablet portrait"],
  [1440, 900, "desktop"],
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
    const panel = document.querySelector('[aria-label="Section: projects"]');
    const section = document.getElementById("projects");
    const body = document.querySelector(".featured-writing-inner-rule-body-top > .profile-card-surface");
    const pr = panel?.getBoundingClientRect();
    const br = body?.getBoundingClientRect();
    return {
      scrollDelta: (section?.scrollHeight ?? 0) - (panel?.clientHeight ?? 0),
      bodyMargin: pr && br ? Math.round(pr.bottom - br.bottom) : null,
      cardH: Math.round(document.querySelector("[data-carousel-card]")?.getBoundingClientRect().height ?? 0),
    };
  });
  console.log(`${label}: scrollDelta=${m.scrollDelta}px bodyMargin=${m.bodyMargin}px cardH=${m.cardH}px`);
  await page.getByRole("button", { name: /Back to menu/i }).click();
  await page.waitForTimeout(300);
}
await browser.close();
