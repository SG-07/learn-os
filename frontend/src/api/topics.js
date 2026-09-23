const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getTopics() {
  const response = await fetch(`${API_BASE_URL}/api/topics`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch topics");
  }

  return response.json();
}