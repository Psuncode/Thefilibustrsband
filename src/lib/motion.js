export const MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";
export const MOTION_STAGGER_STEP_MS = 70;
export const MOTION_STAGGER_MAX_ITEMS = 6;

export const shouldReduceMotion = (mediaQueryList) => {
  return Boolean(mediaQueryList?.matches);
};

export const getMotionItemDelay = (
  index,
  step = MOTION_STAGGER_STEP_MS,
  maxItems = MOTION_STAGGER_MAX_ITEMS
) => {
  const safeIndex = Math.max(0, Math.min(index, maxItems));

  return `${safeIndex * step}ms`;
};

export const createRevealObserverOptions = (reducedMotion) => {
  return reducedMotion
    ? {
        threshold: 0,
        rootMargin: "0px 0px 0px 0px"
      }
    : {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px"
      };
};

const markGroupItems = (group) => {
  const items = Array.from(group.querySelectorAll("[data-motion-item]"));

  items.forEach((item, index) => {
    if (!item.style.getPropertyValue("--motion-delay")) {
      item.style.setProperty("--motion-delay", getMotionItemDelay(index));
    }
  });
};

const activateMotionNode = (node) => {
  node.dataset.motionState = "active";

  if (node.hasAttribute("data-motion-group")) {
    markGroupItems(node);
  }
};

export const initMotion = (root = globalThis.document) => {
  if (typeof window === "undefined" || !root?.querySelectorAll) {
    return () => {};
  }

  const mediaQueryList =
    typeof window.matchMedia === "function"
      ? window.matchMedia(MOTION_MEDIA_QUERY)
      : undefined;
  const reducedMotion = shouldReduceMotion(mediaQueryList);
  const nodes = Array.from(root.querySelectorAll("[data-motion]"));

  if (nodes.length === 0) {
    return () => {};
  }

  nodes.forEach((node) => {
    node.dataset.motionReady = "true";

    if (node.hasAttribute("data-motion-group")) {
      markGroupItems(node);
    }
  });

  if (reducedMotion || typeof IntersectionObserver === "undefined") {
    nodes.forEach(activateMotionNode);
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      activateMotionNode(entry.target);
      observer.unobserve(entry.target);
    });
  }, createRevealObserverOptions(false));

  nodes.forEach((node) => observer.observe(node));

  return () => observer.disconnect();
};
