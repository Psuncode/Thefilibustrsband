import test from "node:test";
import assert from "node:assert/strict";
import {
  MOTION_MEDIA_QUERY,
  MOTION_STAGGER_MAX_ITEMS,
  MOTION_STAGGER_STEP_MS,
  createRevealObserverOptions,
  getMotionItemDelay,
  initMotion,
  shouldReduceMotion
} from "../src/lib/motion.js";

test("exports the prefers-reduced-motion media query used by the helper", () => {
  assert.equal(MOTION_MEDIA_QUERY, "(prefers-reduced-motion: reduce)");
});

test("treats only matching media queries as reduced motion", () => {
  assert.equal(shouldReduceMotion({ matches: true }), true);
  assert.equal(shouldReduceMotion({ matches: false }), false);
  assert.equal(shouldReduceMotion(undefined), false);
});

test("builds stagger delays in fixed increments and clamps long lists", () => {
  assert.equal(MOTION_STAGGER_STEP_MS, 70);
  assert.equal(MOTION_STAGGER_MAX_ITEMS, 6);
  assert.equal(getMotionItemDelay(0), "0ms");
  assert.equal(getMotionItemDelay(1), "70ms");
  assert.equal(getMotionItemDelay(4), "280ms");
  assert.equal(getMotionItemDelay(20), "420ms");
});

test("returns the expected observer options for standard motion", () => {
  assert.deepEqual(createRevealObserverOptions(false), {
    threshold: 0.18,
    rootMargin: "0px 0px -10% 0px"
  });
});

test("returns immediate observer options for reduced motion fallback", () => {
  assert.deepEqual(createRevealObserverOptions(true), {
    threshold: 0,
    rootMargin: "0px 0px 0px 0px"
  });
});

const createFakeMotionNode = () => {
  const styleValues = new Map();

  return {
    dataset: {},
    style: {
      getPropertyValue(name) {
        return styleValues.get(name) ?? "";
      },
      setProperty(name, value) {
        styleValues.set(name, value);
      }
    },
    hasAttribute(name) {
      return name === "data-motion";
    }
  };
};

test("returns a no-op when initialized without browser globals", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  try {
    delete globalThis.window;
    delete globalThis.document;

    const cleanup = initMotion();

    assert.equal(typeof cleanup, "function");
    assert.doesNotThrow(() => cleanup());
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  }
});

test("does not re-observe nodes that were already initialized on the same root", () => {
  const originalWindow = globalThis.window;
  const originalIntersectionObserver = globalThis.IntersectionObserver;
  const nodes = [createFakeMotionNode(), createFakeMotionNode()];
  const observed = [];

  globalThis.window = {
    matchMedia() {
      return { matches: false };
    }
  };
  globalThis.IntersectionObserver = class {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
    }

    observe(node) {
      observed.push(node);
    }

    unobserve() {}

    disconnect() {}
  };

  const root = {
    querySelectorAll(selector) {
      if (selector === "[data-motion]") {
        return nodes;
      }

      return [];
    }
  };

  try {
    initMotion(root);
    initMotion(root);

    assert.equal(observed.length, 2);
    assert.equal(nodes[0].dataset.motionReady, "true");
    assert.equal(nodes[1].dataset.motionReady, "true");
  } finally {
    globalThis.window = originalWindow;
    globalThis.IntersectionObserver = originalIntersectionObserver;
  }
});

test("cleanup allows the same root to be initialized again", () => {
  const originalWindow = globalThis.window;
  const originalIntersectionObserver = globalThis.IntersectionObserver;
  const nodes = [createFakeMotionNode(), createFakeMotionNode()];
  const observed = [];
  let disconnectCount = 0;

  globalThis.window = {
    matchMedia() {
      return { matches: false };
    }
  };
  globalThis.IntersectionObserver = class {
    constructor() {}

    observe(node) {
      observed.push(node);
    }

    unobserve() {}

    disconnect() {
      disconnectCount += 1;
    }
  };

  const root = {
    querySelectorAll(selector) {
      if (selector === "[data-motion]") {
        return nodes;
      }

      return [];
    }
  };

  try {
    const cleanup = initMotion(root);

    cleanup();
    initMotion(root);

    assert.equal(disconnectCount, 1);
    assert.equal(observed.length, 4);
    assert.equal(nodes[0].dataset.motionReady, "true");
    assert.equal(nodes[1].dataset.motionReady, "true");
  } finally {
    globalThis.window = originalWindow;
    globalThis.IntersectionObserver = originalIntersectionObserver;
  }
});
