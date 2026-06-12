import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });

for (const [w, h, label] of [
  [1024, 704, "landscape+chrome"],
  [1024, 768, "landscape full"],
]) {
  await page.setViewportSize({ width: w, height: h });
  await page.getByRole("button", { name: /PORTFOLIO/i }).first().click();
  await page.waitForTimeout(800);
  await page.locator("#menu button").filter({ hasText: "PROJECTS" }).first().click();
  await page.waitForTimeout(2000);

  const m = await page.evaluate(() => {
    const panel = document.querySelector('[aria-label="Section: projects"]');
    const fw = document.querySelector(".featured-writing-shell");
    const cta = document.querySelector(".featured-writing-view-cta");
    const cards = document.querySelector("[data-carousel-card]");
    const pr = panel?.getBoundingClientRect();
    const fr = fw?.getBoundingClientRect();
    const cr = cta?.getBoundingClientRect();
    const cardR = cards?.getBoundingClientRect();
    const section = document.getElementById("projects");
    const body = document.querySelector(".featured-writing-inner-rule-body-top > .profile-card-surface");
    const br = body?.getBoundingClientRect();
    return {
      panelH: panel?.clientHeight,
      sectionScrollH: section?.scrollHeight,
      scrollDelta: (section?.scrollHeight ?? 0) - (panel?.clientHeight ?? 0),
      fwClip: pr && fr ? Math.round(fr.bottom - pr.bottom) : null,
      bodyClip: pr && br ? Math.round(br.bottom - pr.bottom) : null,
      ctaClip: pr && cr ? Math.round(cr.bottom - pr.bottom) : null,
      cardH: cardR ? Math.round(cardR.height) : null,
    };
  });
  console.log(label, m);
  await page.getByRole("button", { name: /Back to menu/i }).click();
  await page.waitForTimeout(300);
}
await browser.close();
