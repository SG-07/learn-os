// frontend/src/api/ai.js

import { request } from "./client";

export async function getAiAnswer({ question, schema }) {
  return request("/api/ai/answer", {
    method: "POST",
    credentials: "include",
    body: { question, schema },
  });
}

export async function getAiGuidance({ question, schema, history, userAttempt }) {
  return request("/api/ai/teach", {
    method: "POST",
    credentials: "include",
    body: { question, schema, history, userAttempt },
  });
}

export async function getSimilarQuestion({ originalQuestion, schema, concept }) {
  return request("/api/ai/similar", {
    method: "POST",
    credentials: "include",
    body: { originalQuestion, schema, concept },
  });
}
