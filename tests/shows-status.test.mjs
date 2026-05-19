import { test } from "node:test";
import assert from "node:assert/strict";
import { formatShowStatus } from "../src/lib/shows/status.ts";

test("formatShowStatus: announced", () => {
  assert.equal(formatShowStatus("announced"), "On sale");
});

test("formatShowStatus: sold-out", () => {
  assert.equal(formatShowStatus("sold-out"), "Sold out");
});

test("formatShowStatus: cancelled spellings", () => {
  assert.equal(formatShowStatus("cancelled"), "Cancelled");
  assert.equal(formatShowStatus("canceled"), "Cancelled");
});

test("formatShowStatus: postponed", () => {
  assert.equal(formatShowStatus("postponed"), "Postponed");
});

test("formatShowStatus: unknown falls back to titlecased input", () => {
  assert.equal(formatShowStatus("draft"), "Draft");
});
