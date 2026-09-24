import { request } from "./client";

export async function getQuestionsByTopic(topicId) {
  return request(`/api/topics/${topicId}/questions`, {
    method: "GET",
    credentials: "include",
  });
}