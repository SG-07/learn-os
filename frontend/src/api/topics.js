import { request } from "./client";

export async function getTopics() {
  return request("/api/topics", {
    method: "GET",
    credentials: "include",
  });
}
