import { useEffect, useState } from "react";

type MasonrySlideLike = {
  readonly src?: string;
};

type MasonryImageRatiosResult = {
  readonly ratiosBySrc: Readonly<Record<string, number>>;
  readonly layoutReady: boolean;
};

const masonryRatioCache = new Map<string, number>();

const uniqueSlideSrcs = (slides: readonly MasonrySlideLike[]): string[] =>
  Array.from(
    new Set(slides.map((slide) => slide.src?.trim()).filter((src): src is string => Boolean(src))),
  );

const ratiosFromCache = (srcs: readonly string[]): Record<string, number> => {
  const next: Record<string, number> = {};
  for (const src of srcs) {
    const ratio = masonryRatioCache.get(src);
    if (ratio) next[src] = ratio;
  }
  return next;
};

const cacheHasAll = (srcs: readonly string[]): boolean =>
  srcs.length > 0 && srcs.every((src) => masonryRatioCache.has(src));

const scheduleIdle = (fn: () => void) => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(() => fn(), { timeout: 400 });
    return;
  }
  window.setTimeout(fn, 50);
};

const readImageRatio = (src: string): Promise<number | undefined> =>
  new Promise((resolve) => {
    const cached = masonryRatioCache.get(src);
    if (cached) {
      resolve(cached);
      return;
    }

    const image = new Image();
    image.decoding = "async";
    let settled = false;

    const finish = (ratio?: number) => {
      if (settled) return;
      settled = true;
      resolve(ratio);
    };

    image.onload = () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        finish(image.naturalWidth / image.naturalHeight);
        return;
      }

      finish();
    };
    image.onerror = () => finish();
    image.src = src;

    if (image.complete) {
      queueMicrotask(() => {
        if (image.naturalWidth > 0 && image.naturalHeight > 0) {
          finish(image.naturalWidth / image.naturalHeight);
          return;
        }

        finish();
      });
    }
  });

/** Warm ratios one-at-a-time on idle so PROJECT DETAILS open is not decode-locked. */
export const prefetchMasonryImageRatios = (slides: readonly MasonrySlideLike[]): void => {
  const slideSrcs = uniqueSlideSrcs(slides).filter((src) => !masonryRatioCache.has(src));
  if (!slideSrcs.length) return;

  const run = (index: number) => {
    if (index >= slideSrcs.length) return;
    void readImageRatio(slideSrcs[index]).then((ratio) => {
      if (ratio) masonryRatioCache.set(slideSrcs[index], ratio);
      scheduleIdle(() => run(index + 1));
    });
  };

  scheduleIdle(() => run(0));
};

export const useMasonryImageRatios = (
  slides: readonly MasonrySlideLike[],
): MasonryImageRatiosResult => {
  const slideSrcs = uniqueSlideSrcs(slides);
  const srcKey = slideSrcs.join("\n");
  const [ratiosBySrc, setRatiosBySrc] = useState<Record<string, number>>(() =>
    ratiosFromCache(slideSrcs),
  );
  const [layoutReady, setLayoutReady] = useState(() => !slideSrcs.length || cacheHasAll(slideSrcs));

  useEffect(() => {
    let cancelled = false;
    const srcs = srcKey ? srcKey.split("\n") : [];

    if (!srcs.length) {
      setRatiosBySrc({});
      setLayoutReady(true);
      return;
    }

    if (cacheHasAll(srcs)) {
      setRatiosBySrc(ratiosFromCache(srcs));
      setLayoutReady(true);
      return;
    }

    setLayoutReady(false);

    void Promise.all(
      srcs.map(async (src) => {
        const ratio = await readImageRatio(src);
        return ratio ? [src, ratio] : null;
      }),
    ).then((entries) => {
      if (cancelled) return;

      const nextRatios = Object.fromEntries(
        entries.filter((entry): entry is [string, number] => Boolean(entry)),
      );
      for (const [src, ratio] of Object.entries(nextRatios)) {
        masonryRatioCache.set(src, ratio);
      }

      setRatiosBySrc(nextRatios);
      setLayoutReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [srcKey]);

  return { ratiosBySrc, layoutReady };
};
