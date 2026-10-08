import { request } from "./client";

export async function getProgress() {
  return request("/api/progress", {
    method: "GET",
  });
}
