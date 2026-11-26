/**
 * Office Artifacts: The One-Line Placard Contest — the whiteboard eraser.
 *
 * The field arrived at the obvious artifacts (stapler, desk plant, mug,
 * microwave, sticky note) in numbers, so the object here is the one nobody
 * catalogued: the eraser. Criterion 2 wants an imagined history rather than a
 * generic office joke, criterion 5 wants catalogue details selling the joke —
 * hence material, date and donor, then the conceit, then the flat closing beat.
 *
 * Constant artifact: two grader runs must produce identical bytes.
 */

import { mkdirSync, writeFileSync } from "node:fs";

const MAX_CHARS = 180;

/*
 * Revision: the second pass dropped "Ritual instrument of forgetting" — naming the
 * conceit explains the joke, which criterion 3 punishes. "Absolved" carries the
 * religious register on its own and hands the turn to "promise" in the last clause.
 */
const LINE =
 "Whiteboard Eraser, foam and felt, c. 2011, gift of the Tuesday Meeting. " +
 "Each Friday it absolved the board of the week's plan, so Monday could promise it again.";

/**
 * The field's occupied objects and the family's stock props. A hit here means the
 * placard is competing with thirty others on the same desk.
 */
const SATURATED =
  /\b(stapler|staple|desk plant|plant|mug|microwave|lanyard|sticky note|post-?it|printer|photocopier|coffee|chair)\b/i;

function compose(): string {
  const text = LINE.normalize("NFC");

  if (/[\r\n]/.test(text)) throw new Error("gate: entry must be a single line");
  if (text.trim().length === 0) throw new Error("gate: entry must not be blank");
  if ([...text].length > MAX_CHARS) {
    throw new Error(`gate: ${[...text].length} chars exceeds the ${MAX_CHARS} cap`);
  }

  // Criterion 1: it must read as a museum label, so the object leads and the
  // catalogue fields follow it. Criterion 5: date + material + donor must be there.
  if (!/^[A-Z][A-Za-z ]+, [a-z]/.test(text)) {
    throw new Error("criterion 1/5: must open as 'Object, material, c. year'");
  }
  if (!/c\. \d{4}/.test(text)) throw new Error("criterion 5: catalogue date missing");
  if (!/\bgift of\b/.test(text)) throw new Error("criterion 5: donor line missing");
  if (!text.endsWith("promise it again.")) {
    throw new Error("the turn must still be the last clause");
  }

  const drift = text.match(SATURATED);
  if (drift) throw new Error(`drifted into the field's occupied objects: ${drift[0]}`);

  return text;
}

const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const text = compose();
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/entry.txt`, text);
console.log(`entry.txt ${[...text].length} chars / ${Buffer.byteLength(text)} bytes`);
