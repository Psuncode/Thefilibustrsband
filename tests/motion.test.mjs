import test from "node:test";
import assert from "node:assert/strict";
import {
  MOTION_MEDIA_QUERY,
  MOTION_STAGGER_MAX_ITEMS,
  MOTION_STAGGER_STEP_MS,
  createRevealObserverOptions,
  getMotionItemDelay,
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
