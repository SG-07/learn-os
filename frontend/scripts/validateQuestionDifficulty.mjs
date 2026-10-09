import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expandedQuestions } from "../../backend/src/data/expandedQuestionBank.js";
import { auditReferenceQuestions } from "../src/data/questionDifficulty.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const testSource = readFileSync(path.join(root, "backend/test/questionBank.test.js"), "utf8");
const migration = readFileSync(path.join(root, "supabase/migrations/003_expand_question_bank.sql"), "utf8");

const existingStart = testSource.indexOf("const existingQuestions = [");
const existingEnd = testSource.indexOf("\n]", existingStart);
const existing = Function(
  `"use strict"; return (${testSource.slice(existingStart + "const existingQuestions = ".length, existingEnd + 2)});`,
)();

const migrationPrompts = [...new Set([...migration.matchAll(/\$prompt\$([^$]*)\$prompt\$/g)].map((match) => match[1]))];
const reference = [...existing, ...expandedQuestions];
const issues = auditReferenceQuestions(reference);

for (const prompt of migrationPrompts) {
  if (!expandedQuestions.some((question) => question.prompt === prompt)) {
    issues.push({ type: "migration-drift", prompt });
  }
}

if (reference.length !== 50) {
  issues.push({ type: "count", expected: 50, actual: reference.length });
}

if (issues.length > 0) {
  console.error(JSON.stringify(issues, null, 2));
  process.exit(1);
}

console.log(`Audited ${reference.length} question prompts. Every prompt has one easy, medium, or hard mapping.`);
