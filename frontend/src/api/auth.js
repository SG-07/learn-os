import { request } from "./client";

export async function logout() {
  return request("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}