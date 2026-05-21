import type { APIRoute } from "astro";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { siteMeta } from "../data/site";
import { aboutPage } from "../data/about";
import { aiPressKit } from "../data/aiPressKit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "../..");

const readAiFile = (name: string): string => {
  const path = join(repoRoot, "public", "ai", name);
  try {
    return readFileSync(path, "utf-8").trim();
  } catch {
    return `(unable to read ai/${name})`;
  }
};

const formatFaqBlock = (entries: ReadonlyArray<{ question: string; answer: string }>) =>
  entries.map((entry) => `Q: ${entry.question}\nA: ${entry.answer}`).join("\n\n");

const LAST_UPDATED = "2026-05-21";

export const GET: APIRoute = () => {
  const body = [
    "# The Filibusters — Full AI Digest",
    "",
    `Last updated: ${LAST_UPDATED}`,
    "",
    "## Canonical paragraph",
    "",
    siteMeta.canonicalParagraph,
    "",
    "---",
    "## Band profile",
    "",
    readAiFile("band-profile.txt"),
    "",
    "---",
    "## Fact sheet",
    "",
    readAiFile("fact-sheet.txt"),
    "",
    "---",
    "## FAQ (concise)",
    "",
    readAiFile("faq.txt"),
    "",
    "---",
    "## Press backgrounder",
    "",
    readAiFile("press-backgrounder.txt"),
    "",
    "---",
    "## Promoter brief",
    "",
    readAiFile("promoter-brief.txt"),
    "",
    "---",
    "## About FAQ (long)",
    "",
    formatFaqBlock(aboutPage.faq),
    "",
    "---",
    "## AI press kit FAQ",
    "",
    formatFaqBlock(aiPressKit.faq),
    "",
    "---",
    `Last updated: ${LAST_UPDATED}`,
    ""
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
