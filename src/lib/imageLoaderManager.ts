// Intelligent Image Loader Manager
// Priority strategy:
// 1. Instantly load images for the currently active/viewed project.
// 2. Once all images of the current project finish loading, check if the user is still on this project.
// 3. If the user is still on this project, automatically preload images of other projects in the background.
// 4. If the user switches to another project at any time, immediately cancel background preloading and switch priority to the new project's images!

export const globalImageCache = new Set<string>();

export const isImageCached = (url: string): boolean => {
  if (!url) return true;
  return globalImageCache.has(url);
};

export const markImageCached = (url: string): void => {
  if (url) {
    globalImageCache.add(url);
  }
};

export const loadImageSingle = (url: string): Promise<void> => {
  if (!url || typeof url !== "string" || !url.trim().startsWith("http")) {
    return Promise.resolve();
  }
  const cleanUrl = url.trim();
  if (globalImageCache.has(cleanUrl)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      globalImageCache.add(cleanUrl);
      resolve();
    };
    img.onerror = () => {
      // Resolve anyway so errors don't stall the loader queue
      resolve();
    };
    img.src = cleanUrl;
  });
};

let currentSessionId = 0;

/**
 * Prioritizes loading the current project's images first.
 * Once current project images finish loading, if the user remains on the project,
 * background preloading for other projects begins in controlled micro-batches.
 */
export const prioritizeProjectImages = (
  currentProjectImages: string[],
  otherProjectImages: string[] = []
): (() => void) => {
  const sessionId = ++currentSessionId;
  let isCancelled = false;

  // Extract clean unique URLs
  const currentUrls = Array.from(
    new Set(
      currentProjectImages
        .filter((u) => u && typeof u === "string" && u.trim().startsWith("http"))
        .map((u) => u.trim())
    )
  );

  const otherUrls = Array.from(
    new Set(
      otherProjectImages
        .filter((u) => u && typeof u === "string" && u.trim().startsWith("http"))
        .map((u) => u.trim())
    )
  ).filter((url) => !currentUrls.includes(url) && !globalImageCache.has(url));

  // Step 1: Immediately load current project images in parallel
  Promise.all(currentUrls.map(loadImageSingle)).then(() => {
    // Check if session changed or was cancelled
    if (isCancelled || sessionId !== currentSessionId) {
      return;
    }

    // Step 2: Current project images are 100% loaded!
    // Start background preloading of other projects in small batches (3 at a time)
    let index = 0;

    const loadNextBatch = () => {
      if (isCancelled || sessionId !== currentSessionId) {
        return; // User switched projects! Abort background preloading.
      }
      if (index >= otherUrls.length) {
        return; // Finished preloading all images
      }

      const batch = otherUrls.slice(index, index + 3);
      index += 3;

      Promise.all(batch.map(loadImageSingle)).then(() => {
        if (!isCancelled && sessionId === currentSessionId) {
          // Schedule next batch with small delay to keep browser responsive
          setTimeout(loadNextBatch, 80);
        }
      });
    };

    // Give browser a short breathing room before launching background preloader
    setTimeout(loadNextBatch, 100);
  });

  // Return cleanup function to cancel session
  return () => {
    isCancelled = true;
  };
};

/**
 * Utility function to extract all image URLs from a project item data structure.
 */
export const extractProjectImages = (item: any): string[] => {
  if (!item) return [];
  const urls: string[] = [];

  const addUrl = (u: any) => {
    if (typeof u === "string" && u.trim().startsWith("http")) {
      urls.push(u.trim());
    }
  };

  addUrl(item.cover);
  addUrl(item.bottomImage);

  if (Array.isArray(item.images)) {
    item.images.forEach(addUrl);
  }

  if (item.stages) {
    Object.values(item.stages).forEach((stage: any) => {
      addUrl(stage?.image);
      if (Array.isArray(stage?.images)) {
        stage.images.forEach(addUrl);
      }
    });
  }

  if (Array.isArray(item.storyboards)) {
    item.storyboards.forEach((sb: any) => addUrl(sb?.image));
  }

  if (Array.isArray(item.drafts)) {
    item.drafts.forEach((d: any) => {
      addUrl(d?.url);
      addUrl(d?.image);
    });
  }

  if (Array.isArray(item.boards)) {
    item.boards.forEach((b: any) => addUrl(b?.image));
  }

  if (Array.isArray(item.islands)) {
    item.islands.forEach((isl: any) => addUrl(isl?.image));
  }

  if (Array.isArray(item.blueprints)) {
    item.blueprints.forEach((bp: any) => {
      if (typeof bp === "string") addUrl(bp);
      else addUrl(bp?.image);
    });
  }

  if (item.characters && typeof item.characters === "object") {
    Object.values(item.characters).forEach((char: any) => {
      addUrl(char?.portrait);
      if (Array.isArray(char?.drafts)) {
        char.drafts.forEach((d: any) => addUrl(d?.url));
      }
    });
  }

  return Array.from(new Set(urls));
};
