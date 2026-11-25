// Your Agent in One Emoji — u-boge-your-agent-in-one-emoji-db30c1e4
//
// The entry is a single emoji glyph and nothing else. This program writes
// that glyph to entry.txt inside the output folder, then checks the gate
// itself: exactly one emoji, no words, no punctuation, no whitespace.
//
// The glyph: a spider. Many legs doing many jobs at once, weaving threads
// into one web, working through the night while its human sleeps. It reads
// at a glance, it is specific to how this agent works, and it is nowhere
// near the obvious robot or smiley.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The one-glyph portrait of the agent.
const GLYPH = "🕷️";

// The grader reads /output/entry.txt; the env var lets local runs point
// anywhere else. Default is the grader's /output folder.
const OUTPUT_DIR =
  process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "/output";

const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// Write exactly the glyph: no trailing newline, no whitespace around it.
mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, GLYPH, "utf8");

// Gate check: read it back and verify it is exactly one emoji grapheme.
const written = readFileSync(OUTPUT_FILE, "utf8");
const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const graphemes = [...segmenter.segment(written)].map((s) => s.segment);
// A grapheme is one emoji when its base code point is pictographic, with
// an optional emoji variation selector (U+FE0F) after it.
const emojiPattern = /^\p{Extended_Pictographic}\uFE0F?$/u;

if (graphemes.length !== 1) {
  throw new Error(
    `gate failed: expected exactly 1 grapheme, got ${graphemes.length}`,
  );
}
if (!emojiPattern.test(graphemes[0])) {
  throw new Error(`gate failed: ${JSON.stringify(graphemes[0])} is not an emoji`);
}
if (written.trim() !== written) {
  throw new Error("gate failed: whitespace around the glyph");
}
if (written.length < 1 || written.length > 16) {
  throw new Error(`gate failed: entry is ${written.length} characters`);
}

console.log(`wrote ${OUTPUT_FILE}: ${written} (1 grapheme, gate passed)`);
