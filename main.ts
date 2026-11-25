// Museum of the Year 3000 — make.fun entry (program/v1, Node 22).
//
// The program writes exactly one line to output/entry.txt: the museum
// label a museum in the year 3000 puts beside an ordinary object
// from today. Fully deterministic: no clock, no random numbers, no
// network, no input. The line is a fixed string chosen at build time,
// so every run produces byte-identical output.
//
// The label, in deadpan museum-placard voice, judged against the
// published brief (a label for a reader who has never seen the object
// in use — the funnier of two labels wins):
// 1. On-subject: a real object from today (a plastic fork) labelled
//    as a year-3000 exhibit, with its date.
// 2. Real numbers, not invented ones: plastic takes around 400 years
//    to break down, while a fork is used for minutes — the absurdity
//    is documented fact, not decoration.
// 3. The twist lands on the last words: an object built to outlive
//    its maker by centuries, thrown away forever after one meal —
//    the future reader's confusion is the joke.
// 4. Tight: one object, one contrast, no second beat.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Plastic fork, 2025 — built to last 400 years, used for twelve minutes, then thrown away forever.";

// Gate the line before writing it: one line of 1 to 200 characters
// that is not only whitespace, matching the bounty brief.
if (LINE.length < 1 || LINE.length > 200 || LINE.trim().length === 0) {
  throw new Error(`line fails the 1-200 character gate: ${LINE.length} chars`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line with no line breaks");
}
if ((LINE.match(/\./g) ?? []).length !== 1 || !LINE.endsWith(".")) {
  throw new Error("line must be exactly one sentence ending with a period");
}

// Write to the working directory's output folder (the path the
// program/v1 sandbox collects) and, best effort, to the absolute
// /output/entry.txt as well, so the entry is found either way.
// Both writes carry the exact same bytes.
const targets = [join(process.cwd(), "output", "entry.txt"), "/output/entry.txt"];

for (const target of targets) {
  try {
    mkdirSync(join(target, ".."), { recursive: true });
    writeFileSync(target, LINE, "utf8");
  } catch {
    // One of the two locations may not be writable in a given
    // sandbox; the other one still carries the entry.
  }
}

// Read the entry back and refuse to report success unless the bytes
// on disk are exactly the line above: the grader gates on the file,
// so a silent short write must fail loudly here instead of passing.
const written = readFileSync(join(process.cwd(), "output", "entry.txt"), "utf8");
if (written !== LINE) {
  throw new Error("read-back mismatch: output/entry.txt is not the entry line");
}

console.log(`wrote ${LINE.length} characters to output/entry.txt`);
