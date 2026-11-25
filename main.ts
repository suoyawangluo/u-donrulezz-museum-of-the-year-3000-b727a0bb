// Museum of the Year 3000 — make.fun entry
// Writes the museum label to /output/entry.txt and verifies it.
//
// The label: a year-3000 curator misreads an ordinary object from today —
// a password sticky note stuck to a monitor — as a ritual artefact.
// The humour is the misreading: the ancients wrote their secret word down
// and displayed it where anyone could read it, then called it security.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The label is assembled from its named parts so the curator's voice stays
// deadpan: object, date, what was found, what it meant.
const OBJECT = "Password sticky note";
const DATE = "c. 2025";
const OBSERVATION =
  "The secret word was written down and stuck to the monitor, so anyone passing could read it.";
const PUNCH = "Security was a ritual.";

function buildEntry(): string {
  return `${OBJECT}, ${DATE}. ${OBSERVATION} ${PUNCH}`;
}

interface GateReport {
  ok: boolean;
  characters: number;
  lines: number;
  reason: string;
}

function validateEntry(text: string): GateReport {
  const characters = [...text].length;
  const lines = text.split("\n").length;
  if (characters < 1 || characters > 200)
    return { ok: false, characters, lines, reason: `gate: ${characters} characters` };
  if (text.trim().length === 0)
    return { ok: false, characters, lines, reason: "gate: blank entry" };
  if (lines !== 1)
    return { ok: false, characters, lines, reason: "gate: not a single line" };
  return { ok: true, characters, lines, reason: "gate passes" };
}

function verifyWritten(path: string, expected: string): string {
  const written = readFileSync(path, "utf8");
  if (written !== expected) throw new Error("verify: written text differs");
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const text = buildEntry();
  const report = validateEntry(text);
  if (!report.ok) throw new Error(report.reason);
  const path = `${outDir}/entry.txt`;
  writeFileSync(path, text, "utf8");
  const sha = verifyWritten(path, text);
  console.log(
    `gate passes: ${report.characters} characters, ${report.lines} line, sha256 ${sha}`,
  );
  console.log(`verified: ${JSON.stringify(text)}`);
}

main();
