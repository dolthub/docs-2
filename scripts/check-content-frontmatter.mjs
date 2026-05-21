#!/usr/bin/env node
// Build-time guard for docs content pages.
//
// The three docs sites load Markdown via `await import(...)` rather than
// Astro's content collections, so a Zod `defineCollection` schema would
// never actually run. This script enforces the same invariants at build
// time instead: every content page must have a lowercase `title:` in its
// frontmatter and at least one H1 (`# ...`) outside fenced code blocks.
//
// Usage: node scripts/check-content-frontmatter.mjs <content-dir>
// Exits non-zero (failing the build) if any page violates the rules.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.argv[2];
if (!root) {
  console.error("usage: check-content-frontmatter.mjs <content-dir>");
  process.exit(2);
}

// Collect every .md file under the content dir, skipping GitBook assets.
function findMarkdown(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === ".gitbook") continue;
      out.push(...findMarkdown(full));
    } else if (entry.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

// Returns the frontmatter block lines, or null if the file has no
// frontmatter starting on line 1.
function frontmatter(lines) {
  if (lines[0]?.trim() !== "---") return null;
  const end = lines.indexOf("---", 1);
  if (end === -1) return null;
  return lines.slice(1, end);
}

function hasLowercaseTitle(fmLines) {
  // Exactly `title:` with a non-empty value. `Title:` (any other case)
  // does not count — that's the miscased-key bug this guard catches.
  return fmLines.some(l => /^title:\s*\S/.test(l));
}

function hasH1(lines) {
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && /^# \S/.test(line)) return true;
  }
  return false;
}

const problems = [];
const files = findMarkdown(root);

for (const file of files) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const fm = frontmatter(lines);
  const rel = relative(process.cwd(), file);

  if (fm === null) {
    problems.push(`${rel}: missing frontmatter block`);
    continue;
  }
  if (!hasLowercaseTitle(fm)) {
    problems.push(`${rel}: missing lowercase \`title:\` in frontmatter`);
  }
  if (!hasH1(lines)) {
    problems.push(`${rel}: missing an H1 heading (\`# ...\`)`);
  }
}

if (problems.length > 0) {
  console.error(
    `\ncheck-content-frontmatter: ${problems.length} problem(s) in ${files.length} pages under ${root}:\n`,
  );
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error("");
  process.exit(1);
}

console.log(
  `check-content-frontmatter: ${files.length} pages OK (title + H1) under ${root}`,
);
