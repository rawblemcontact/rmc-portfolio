/**
 * Typography hierarchy metrics — load via browser_run_code_unsafe `filename`.
 *
 * Wrapper example (edit sectionId / sweepPortfolio):
 *   await page.goto('http://localhost:5173');
 *   // open section first, or let script click NAV
 *   return await <this script>(page);
 *
 * Config — edit constants below or inject via evaluate before call.
 */
async (page) => {
  const sectionId = 'projects';
  const sweepPortfolio = true;
  const waitMs = 800;
  const viewport = { width: 1440, height: 900 };

  const SECTION_ROLES = {
    projects: {
      display: '#projects .section-main-header-title',
      headline: '#projects .featured-writing-item-title',
      card: '#projects .project-card-title',
      ui: '#projects .featured-writing-folder [role="tablist"] button span',
      body: '#projects .project-card-tagline',
      bodyAlt: '#projects .featured-writing-item-subtitle',
      eyebrow: '#projects .featured-writing-view-cta',
      expectedOrder: ['display', 'headline', 'card', 'ui', 'body', 'eyebrow'],
    },
    profile: {
      display: '#profile .section-main-header-title',
      body: '#profile .font-body.text-mono-2',
      eyebrow: '#profile .font-mono.uppercase',
      expectedOrder: ['display', 'body', 'eyebrow'],
    },
    experience: {
      display: '#experience .section-main-header-title',
      subhead: '#experience .section-subhead-title',
      rail: '#experience .career-nav-rail-title',
      body: '#experience .font-body.text-mono-2',
      expectedOrder: ['display', 'subhead', 'rail', 'body'],
    },
    skills: {
      display: '#skills .section-main-header-title',
      rail: '#skills .skills-branch-header--page .career-nav-section-subtitle',
      columnTitle: '#skills .skills-subcategory-column-title',
      body: '#skills .skills-page-card-row',
      railEyebrow: '#skills .skills-branch-header--page .career-nav-section-title',
      expectedOrder: ['display', 'rail', 'columnTitle', 'body', 'railEyebrow'],
    },
    social: {
      display: '#social .section-main-header-title',
      body: '#social .font-body.text-mono-2',
      expectedOrder: ['display', 'body'],
    },
  };

  const NAV_CLICK_LABEL = {
    projects: 'PROJECTS',
    profile: 'PROFILE',
    experience: 'EXPERIENCE',
    skills: 'SKILLS',
    social: 'CONTACT',
  };

  await page.setViewportSize(viewport);
  if (waitMs > 0) await page.waitForTimeout(waitMs);

  const openSection = async (id) => {
    const label = NAV_CLICK_LABEL[id];
    if (!label) return false;
    await page.evaluate((navLabel) => {
      const btn = [...document.querySelectorAll('button')].find(
        (b) => b.textContent?.includes(navLabel),
      );
      btn?.click();
    }, label);
    await page.waitForTimeout(600);
    return true;
  };

  const measureRoles = (roles) =>
    page.evaluate((roleSelectors) => {
      const px = (sel) => {
        if (!sel) return null;
        const el = document.querySelector(sel);
        if (!el) return null;
        return Math.round(parseFloat(getComputedStyle(el).fontSize) * 100) / 100;
      };
      const out = {};
      for (const [role, sel] of Object.entries(roleSelectors)) {
        if (role === 'expectedOrder') continue;
        out[role] = px(sel);
      }
      return out;
    }, roles);

  const measurePortfolioTokens = () =>
    page.evaluate(() => {
      const root = document.documentElement;
      const cs = getComputedStyle(root);
      const px = (v) => {
        const n = parseFloat(v);
        return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
      };
      const tokenPx = (name) => px(cs.getPropertyValue(name));
      return {
        sectionMainDisplay: tokenPx('--section-main-font-display'),
        sectionSubhead: tokenPx('--section-subhead-font'),
        sectionRail: tokenPx('--section-rail-font'),
        sectionEyebrow: tokenPx('--section-eyebrow-font'),
      };
    });

  const analyzeHierarchy = (roles, expectedOrder) => {
    const sizes = expectedOrder
      .map((role) => ({ role, px: roles[role] }))
      .filter((r) => r.px != null);
    const issues = [];
    for (let i = 0; i < sizes.length - 1; i++) {
      const a = sizes[i];
      const b = sizes[i + 1];
      const delta = a.px - b.px;
      if (delta < 1.5) {
        issues.push(`flat: ${a.role} (${a.px}px) ≈ ${b.role} (${b.px}px)`);
      }
      if (delta < 0) {
        issues.push(`inverted: ${b.role} (${b.px}px) > ${a.role} (${a.px}px)`);
      }
    }
    const display = roles.display ?? roles.headline;
    const ratios = {};
    if (display) {
      for (const [role, px] of Object.entries(roles)) {
        if (px != null && role !== 'expectedOrder') {
          ratios[`${role}PerDisplay`] = Math.round((px / display) * 1000) / 1000;
        }
      }
    }
    return { sizes, issues, ratios, hierarchyOk: issues.length === 0 };
  };

  const portfolioSections = {};
  if (sweepPortfolio) {
    for (const id of Object.keys(NAV_CLICK_LABEL)) {
      await openSection(id);
      const roles = SECTION_ROLES[id];
      if (!roles) continue;
      const measured = await measureRoles(roles);
      portfolioSections[id] = {
        displayPx: measured.display ?? null,
        bodyPx: measured.body ?? measured.bodyAlt ?? measured.subhead ?? null,
        roles: measured,
      };
    }
    await openSection(sectionId);
  } else {
    await openSection(sectionId);
  }

  const config = SECTION_ROLES[sectionId];
  if (!config) {
    return { error: 'unknown sectionId', sectionId, known: Object.keys(SECTION_ROLES) };
  }

  const sectionRoles = await measureRoles(config);
  const portfolioTokens = await measurePortfolioTokens();
  const hierarchy = analyzeHierarchy(sectionRoles, config.expectedOrder);

  const displayPx = sectionRoles.display;
  const portfolioDisplaySamples = Object.values(portfolioSections)
    .map((s) => s.displayPx)
    .filter((v) => v != null);
  const portfolioDisplayMedian =
    portfolioDisplaySamples.length > 0
      ? Math.round(
          (portfolioDisplaySamples.sort((a, b) => a - b)[
            Math.floor(portfolioDisplaySamples.length / 2)
          ] ?? 0) * 100,
        ) / 100
      : null;

  const portfolioParity = [];
  if (displayPx != null && portfolioDisplayMedian != null) {
    const drift = Math.abs(displayPx - portfolioDisplayMedian);
    if (drift > 2) {
      portfolioParity.push(
        `display drift: ${sectionId} ${displayPx}px vs portfolio median ${portfolioDisplayMedian}px (Δ${drift}px)`,
      );
    }
  }
  const bodyPx = sectionRoles.body ?? sectionRoles.bodyAlt;
  if (bodyPx != null && portfolioTokens.sectionEyebrow != null) {
    if (bodyPx < portfolioTokens.sectionEyebrow - 0.5) {
      portfolioParity.push(
        `muted body ${bodyPx}px below portfolio eyebrow token ${portfolioTokens.sectionEyebrow}px`,
      );
    }
  }

  return {
    viewport,
    sectionId,
    sectionRoles,
    hierarchy,
    portfolioTokens,
    portfolioSections: sweepPortfolio ? portfolioSections : undefined,
    portfolioDisplayMedian,
    portfolioParity,
    typographyOk: hierarchy.hierarchyOk && portfolioParity.length === 0,
  };
};
