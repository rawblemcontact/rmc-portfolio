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

async function measure(w, h, label) {
  await page.setViewportSize({ width: w, height: h });
  await page.getByRole("button", { name: /PORTFOLIO/i }).first().click();
  await page.waitForTimeout(800);
  await page.locator("#menu button").filter({ hasText: "SKILLS" }).first().click();
  await page.waitForTimeout(1200);

  const m = await page.evaluate(() => {
    const panel = document.querySelector('[aria-label="Section: skills"]');
    const section = document.getElementById("skills");
    const lastCard = document.querySelector(
      ".skills-page-band--tools .skills-card-surface--page:last-child",
    );
    const pr = panel?.getBoundingClientRect();
    const lr = lastCard?.getBoundingClientRect();
    return {
      scrollDelta: (section?.scrollHeight ?? 0) - (panel?.clientHeight ?? 0),
      margin: pr && lr ? Math.round(pr.bottom - lr.bottom) : null,
    };
  });
  console.log(`${label}: scrollDelta=${m.scrollDelta}px margin=${m.margin}px`);
  await page.getByRole("button", { name: /Back to menu/i }).click();
  await page.waitForTimeout(300);
}

for (const [w, h, label] of viewports) await measure(w, h, label);
await browser.close();
