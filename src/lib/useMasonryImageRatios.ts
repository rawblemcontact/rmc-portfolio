import { useEffect, useState } from "react";

type MasonrySlideLike = {
  readonly src?: string;
};

type MasonryImageRatiosResult = {
  readonly ratiosBySrc: Readonly<Record<string, number>>;
  readonly layoutReady: boolean;
};

const readImageRatio = (src: string): Promise<number | undefined> =>
  new Promise((resolve) => {
    const image = new Image();
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

export const useMasonryImageRatios = (
  slides: readonly MasonrySlideLike[],
): MasonryImageRatiosResult => {
  const [ratiosBySrc, setRatiosBySrc] = useState<Record<string, number>>({});
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const slideSrcs = Array.from(
      new Set(slides.map((slide) => slide.src?.trim()).filter((src): src is string => Boolean(src))),
    );

    if (!slideSrcs.length) {
      setRatiosBySrc({});
      setLayoutReady(true);
      return;
    }

    setLayoutReady(false);

    void Promise.all(
      slideSrcs.map(async (src) => {
        const ratio = await readImageRatio(src);
        return ratio ? [src, ratio] : null;
      }),
    ).then((entries) => {
      if (cancelled) return;

      const nextRatios = Object.fromEntries(
        entries.filter((entry): entry is [string, number] => Boolean(entry)),
      );

      setRatiosBySrc(nextRatios);
      setLayoutReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [slides]);

  return { ratiosBySrc, layoutReady };
};
