
import { getAccessToken } from "@/lib/utils/cookies";

class ApiClient {
  async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = await getAccessToken(); // your cookie utility
    console.log("Token", token);

    const res = await fetch(`/api/proxy/${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(message);
    }

    return res.json();
  }
}

export const HttpClient = new ApiClient();
