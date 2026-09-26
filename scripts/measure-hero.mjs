import { chromium } from "playwright";

const viewports = [
  [1920, 1080, "desktop-1920"],
  [1440, 900, "desktop-1440"],
  [1024, 768, "tablet-landscape"],
  [768, 1024, "tablet-portrait"],
  [430, 932, "mobile-large"],
  [375, 812, "mobile-small"],
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(3500);

async function measure(w, h, label) {
  await page.setViewportSize({ width: w, height: h });
  await page.waitForTimeout(600);

  const m = await page.evaluate(() => {
    const hero = document.getElementById("hero");
    const doc = document.documentElement;
    const overflowX = doc.scrollWidth > doc.clientWidth + 1;
    const robbie = [...document.querySelectorAll("span")].find(
      (el) => el.textContent?.trim() === "ROBBIE",
    );
    const mcl = [...document.querySelectorAll("span")].find(
      (el) => el.textContent?.trim() === "MCLAUGHLIN",
    );
    const tagline = [...document.querySelectorAll("p")].find((el) =>
      el.textContent?.includes("Writer / digital media"),
    );
    const portfolioBtn = document.querySelector('button[type="button"]');
    const video = hero?.querySelector("video, img[alt]");
    const heroRect = hero?.getBoundingClientRect();
    const robbieRect = robbie?.getBoundingClientRect();
    const mclRect = mcl?.getBoundingClientRect();
    const tagRect = tagline?.getBoundingClientRect();
    const btnRect = portfolioBtn?.getBoundingClientRect();
    const videoRect = video?.getBoundingClientRect();

    const offLeft = (r) => (r ? Math.round(r.left) : null);
    const offRight = (r) => (r ? Math.round(r.right - window.innerWidth) : null);

    return {
      overflowX,
      scrollW: doc.scrollWidth,
      clientW: doc.clientWidth,
      heroH: heroRect ? Math.round(heroRect.height) : null,
      robbie: robbieRect
        ? {
            left: offLeft(robbieRect),
            right: offRight(robbieRect),
            w: Math.round(robbieRect.width),
          }
        : null,
      mcl: mclRect
        ? {
            left: offLeft(mclRect),
            right: offRight(mclRect),
            w: Math.round(mclRect.width),
          }
        : null,
      tagline: tagRect
        ? {
            left: offLeft(tagRect),
            right: offRight(tagRect),
            w: Math.round(tagRect.width),
          }
        : null,
      btn: btnRect
        ? {
            left: offLeft(btnRect),
            right: offRight(btnRect),
            w: Math.round(btnRect.width),
            visible: btnRect.width > 0 && btnRect.height > 0,
          }
        : null,
      video: videoRect
        ? {
            left: offLeft(videoRect),
            right: offRight(videoRect),
            w: Math.round(videoRect.width),
            h: Math.round(videoRect.height),
          }
        : null,
      btnOverlapsMcl:
        btnRect && mclRect
          ? !(btnRect.left >= mclRect.right || btnRect.right <= mclRect.left)
          : null,
    };
  });

  const issues = [];
  if (m.overflowX) issues.push(`overflowX scrollW=${m.scrollW} clientW=${m.clientW}`);
  if (m.robbie?.left != null && m.robbie.left < -2) issues.push(`robbie off-left ${m.robbie.left}`);
  if (m.robbie?.right != null && m.robbie.right > 2) issues.push(`robbie off-right ${m.robbie.right}`);
  if (m.mcl?.right != null && m.mcl.right > 2) issues.push(`mcl off-right ${m.mcl.right}`);
  if (m.tagline?.right != null && m.tagline.right > 2) issues.push(`tagline off-right ${m.tagline.right}`);
  if (m.video?.left != null && m.video.left < -2) issues.push(`video off-left ${m.video.left}`);
  if (m.video?.right != null && m.video.right > 2) issues.push(`video off-right ${m.video.right}`);
  if (m.btnOverlapsMcl && m.btn?.right != null && m.btn.right > 2)
    issues.push("btn overlaps mcl and bleeds right");

  console.log(
    JSON.stringify({
      label,
      w,
      h,
      issues,
      metrics: m,
    }),
  );
}

for (const [w, h, label] of viewports) await measure(w, h, label);
await browser.close();
