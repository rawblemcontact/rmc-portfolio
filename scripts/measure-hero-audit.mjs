import { chromium } from "playwright";

const viewports = [
  [768, 1024, "tablet-portrait"],
  [430, 932, "mobile-large"],
  [375, 812, "mobile-small"],
];

const browser = await chromium.launch();

for (const [w, h, label] of viewports) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: h });
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(5000);

  const m = await page.evaluate((lbl) => {
    const doc = document.documentElement;
    const hero = document.getElementById("hero");
    const overflowX = doc.scrollWidth > doc.clientWidth + 1;
    const gridEl = hero?.querySelector("[class*='grid-rows']");
    const gridChildren = gridEl ? [...gridEl.children] : [];

    const videoCard = hero?.querySelector("video")?.closest(".overflow-hidden.rounded-\\[11px\\]") ??
      hero?.querySelector("video")?.parentElement?.parentElement?.parentElement;

    const robbie = [...document.querySelectorAll("span")].find(
      (el) => el.textContent?.trim() === "ROBBIE",
    );
    const portfolioBtn = [...document.querySelectorAll("button")].find((el) =>
      el.textContent?.includes("PORTFOLIO"),
    );
    const texts = portfolioBtn?.querySelector(".texts");

    const r = (el) => (el ? el.getBoundingClientRect() : null);
    const videoRect = r(videoCard);
    const robbieRect = r(robbie);
    const btnRect = r(portfolioBtn);
    const textsRect = r(texts);

    return {
      label: lbl,
      overflowX,
      gapVideoToRobbie:
        robbieRect && videoRect ? Math.round(robbieRect.top - videoRect.bottom) : null,
      videoCard: videoRect
        ? {
            top: Math.round(videoRect.top),
            bottom: Math.round(videoRect.bottom),
            h: Math.round(videoRect.height),
          }
        : null,
      row1: gridChildren[0]
        ? {
            top: Math.round(gridChildren[0].getBoundingClientRect().top),
            h: Math.round(gridChildren[0].getBoundingClientRect().height),
          }
        : null,
      row2: gridChildren[1]
        ? {
            top: Math.round(gridChildren[1].getBoundingClientRect().top),
            h: Math.round(gridChildren[1].getBoundingClientRect().height),
          }
        : null,
      btn: btnRect
        ? { w: Math.round(btnRect.width), h: Math.round(btnRect.height) }
        : null,
      texts: textsRect ? { w: Math.round(textsRect.width) } : null,
      btnTextOverflow:
        btnRect && textsRect ? Math.round(textsRect.right - btnRect.right) : null,
    };
  }, label);

  const issues = [];
  if (m.overflowX) issues.push("overflowX");
  if (m.btnTextOverflow != null && m.btnTextOverflow > 1)
    issues.push(`btn text overflows by ${m.btnTextOverflow}px`);
  if (m.gapVideoToRobbie != null && m.gapVideoToRobbie > 100)
    issues.push(`gap video→name ${m.gapVideoToRobbie}px`);

  console.log(JSON.stringify({ ...m, issues }));
  await page.close();
}

await browser.close();
