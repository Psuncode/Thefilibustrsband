import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFaqSchema } from "../src/lib/seo/faq.ts";

test("builds FAQPage with 3 questions", () => {
  const out = buildFaqSchema([
    { question: "Q1", answer: "A1" },
    { question: "Q2", answer: "A2" },
    { question: "Q3", answer: "A3" }
  ]);

  assert.equal(out["@context"], "https://schema.org");
  assert.equal(out["@type"], "FAQPage");
  assert.equal(out.mainEntity.length, 3);
  assert.equal(out.mainEntity[0]["@type"], "Question");
  assert.equal(out.mainEntity[0].name, "Q1");
  assert.equal(out.mainEntity[0].acceptedAnswer["@type"], "Answer");
  assert.equal(out.mainEntity[0].acceptedAnswer.text, "A1");
});

test("throws on empty input", () => {
  assert.throws(() => buildFaqSchema([]), /at least one/i);
});

test("preserves order", () => {
  const out = buildFaqSchema([
    { question: "first", answer: "one" },
    { question: "second", answer: "two" }
  ]);
  assert.equal(out.mainEntity[0].name, "first");
  assert.equal(out.mainEntity[1].name, "second");
});
