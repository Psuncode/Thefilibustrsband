import test from "node:test";
import assert from "node:assert/strict";
import {
  getTrackedClickEvent,
  getTrackedFormEvent,
  getTrackedLinkEvent
} from "../src/lib/analytics.js";

test("returns outbound music click details from link dataset", () => {
  const event = getTrackedLinkEvent({
    trackMusicPlatform: "spotify",
    trackMusicLocation: "listen-primary"
  });

  assert.deepEqual(event, {
    eventName: "outbound_music_click",
    properties: {
      location: "listen-primary",
      platform: "spotify"
    }
  });
});

test("returns generic tracked link details from dataset", () => {
  const event = getTrackedLinkEvent({
    trackEvent: "booking_email_click",
    trackLabel: "press",
    trackSource: "press-page"
  });

  assert.deepEqual(event, {
    eventName: "booking_email_click",
    properties: {
      label: "press",
      source: "press-page"
    }
  });
});

test("returns tracked form details from dataset", () => {
  const event = getTrackedFormEvent({
    trackEvent: "subscribe_submit",
    trackSource: "subscribe-modal",
    trackLabel: "kit-form"
  });

  assert.deepEqual(event, {
    eventName: "subscribe_submit",
    properties: {
      label: "kit-form",
      source: "subscribe-modal"
    }
  });
});

test("returns tracked click details for non-link elements", () => {
  const event = getTrackedClickEvent({
    trackEvent: "subscribe_open",
    trackLabel: "footer-cta",
    trackSource: "footer"
  });

  assert.deepEqual(event, {
    eventName: "subscribe_open",
    properties: {
      label: "footer-cta",
      source: "footer"
    }
  });
});

test("ignores incomplete tracking datasets", () => {
  assert.equal(getTrackedLinkEvent({ trackEvent: "", trackSource: "footer" }), null);
  assert.equal(getTrackedClickEvent({ trackSource: "footer" }), null);
  assert.equal(getTrackedFormEvent({ trackSource: "subscribe-modal" }), null);
});
