/**
 * Playwright fold metrics — load via browser_run_code_unsafe `filename`.
 * Optional: pass section via page context before call, or edit constants below.
 */
async (page) => {
  const sectionLabel = 'Section: projects';
  const sectionId = 'projects';
  const waitMs = 800;

  if (waitMs > 0) await page.waitForTimeout(waitMs);

  return page.evaluate(({ sectionLabel, sectionId }) => {
    const panel = sectionLabel
      ? document.querySelector(`[aria-label="${sectionLabel}"]`)
      : document.querySelector('[aria-label^="Section:"]');
    const section = sectionId
      ? document.getElementById(sectionId)
      : panel?.querySelector('section[id]') ?? null;

    if (!panel) return { error: 'panel not found', sectionLabel, sectionId };

    const pr = panel.getBoundingClientRect();
    const panelOverflowPx = panel.scrollHeight - panel.clientHeight;

    let topGapPx = null;
    let bottomGapPx = null;
    let gapDeltaPx = null;
    let clipped = false;
    let contentHeightPx = null;
    let headerFontPx = null;
    let cardHeightPx = null;

    if (section) {
      const headerBlock =
        section.querySelector('.projects-showcase-header-block') ??
        section.querySelector('.nav-header') ??
        section.querySelector('.skills-header') ??
        section.querySelector('.section-main-header-title')?.closest('div');

      const lastBlock =
        section.querySelector('.projects-showcase-featured-block') ??
        section.querySelector('.skills-page-layout') ??
        section.querySelector('.main-container') ??
        section.lastElementChild;

      if (headerBlock) {
        topGapPx = Math.round(headerBlock.getBoundingClientRect().top - pr.top);
      }

      if (lastBlock) {
        const fr = lastBlock.getBoundingClientRect();
        bottomGapPx = Math.round(pr.bottom - fr.bottom);
        clipped = fr.bottom > pr.bottom + 2;
      }

      if (topGapPx != null && bottomGapPx != null) {
        gapDeltaPx = topGapPx - bottomGapPx;
      }

      contentHeightPx = Math.round(section.getBoundingClientRect().height);

      const headerTitle =
        section.querySelector('.section-main-header-title') ??
        section.querySelector('.career-nav-section-subtitle');
      if (headerTitle) headerFontPx = getComputedStyle(headerTitle).fontSize;

      const card =
        section.querySelector('[data-carousel-card]') ??
        section.querySelector('.skills-card-surface--page');
      if (card) cardHeightPx = Math.round(card.getBoundingClientRect().height);
    }

    return {
      viewport: { w: window.innerWidth, h: window.innerHeight },
      panelOverflowPx,
      topGapPx,
      bottomGapPx,
      gapDeltaPx,
      clipped,
      contentHeightPx,
      headerFontPx,
      cardHeightPx,
      horizontalBleed: document.documentElement.scrollWidth > window.innerWidth,
      panelClientH: Math.round(pr.height),
    };
  }, { sectionLabel, sectionId });
};
