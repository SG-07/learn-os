import { request } from "./client";

export async function logout() {
  return request("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function changePassword(currentPassword, newPassword) {
  return request("/api/auth/change-password", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
}