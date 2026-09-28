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

export async function adminChangePassword(email, newPassword) {
  return request("/api/auth/admin/change-password", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      newPassword,
    }),
  });
}

export async function getUsers(page = 1, limit = 15, search = "") {
  const params = new URLSearchParams({
    page,
    limit,
    ...(search && { search }),
  });
  return request(`/api/auth/users?${params}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function getUserDetails(userId) {
  return request(`/api/auth/users/${userId}`, {
    method: "GET",
    credentials: "include",
  });
}