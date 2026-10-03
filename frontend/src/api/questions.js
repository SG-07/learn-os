import { request } from "./client";

export async function getQuestionsByTopic(topicId) {
  return request(`/api/topics/${topicId}/questions`, {
    method: "GET",
    credentials: "include",
  });
}

export async function getQuestionById(questionId) {
  return request(`/api/questions/${questionId}`, {
    method: "GET",
  });
}

export async function executeQuestion(questionId, sql) {
  return request(`/api/questions/${questionId}/execute`, {
    method: "POST",
    body: { sql },
  });
}

export async function requestHint(questionId) {
  return request(`/api/questions/${questionId}/hint`, {
    method: "POST",
    body: {},
  });
}